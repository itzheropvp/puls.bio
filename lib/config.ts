export const featureFlags = {
  registrationEnabled: process.env.NEXT_PUBLIC_REGISTRATION_ENABLED === 'true',
};

export const siteConfig = {
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
};
