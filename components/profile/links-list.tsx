interface Link {
    id: string;
    title: string;
    url: string;
    icon?: string | null;
  }
  
  interface LinksListProps {
    links: Link[];
  }
  
  export default function LinksList({ links }: LinksListProps) {
    if (links.length === 0) {
      return (
        <div className="text-center py-16 mt-8">
          <p className="text-gray-500 text-sm">
            No links yet. Check back soon!
          </p>
        </div>
      );
    }
  
    return (
      <div className="space-y-3 mt-8">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {link.icon && (
                    <span className="text-2xl flex-shrink-0">{link.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-0.5 truncate">
                      {link.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {new URL(link.url).hostname}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors flex-shrink-0 ml-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }