import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarData } = body;

    if (!avatarData || typeof avatarData !== 'string') {
      return NextResponse.json(
        { error: 'Invalid avatar data' },
        { status: 400 }
      );
    }

    // In production, you would upload to a service like S3, Cloudinary, or similar
    // For now, we'll store the base64 data directly (not recommended for production)
    // You should implement proper file upload handling

    // Validate it's a valid base64 image
    if (!avatarData.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }

    // Check file size (max 5MB)
    const sizeInBytes = Buffer.byteLength(avatarData, 'utf8');
    if (sizeInBytes > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // TODO: Implement actual file upload to cloud storage
    // For now, we'll store it as is. In production, upload to S3/Cloudinary/etc
    
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        avatarUrl: avatarData, // In production, store the cloud URL instead
      },
      select: {
        avatarUrl: true,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
