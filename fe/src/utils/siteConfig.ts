const CONFIG_KEY = 'levents-site-config';

export interface SiteConfig {
  storeName: string;
  hotline: string;
  email: string;
  address: string;
  codEnabled: boolean;
  bankingEnabled: boolean;
  shipFee: number;
  freeShipThreshold: number;
}

const DEFAULT_CONFIG: SiteConfig = {
  storeName: 'LEVENTS° CLONE',
  hotline: '1900 1234',
  email: 'support@levents.vn',
  address: '54-56 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  codEnabled: true,
  bankingEnabled: true,
  shipFee: 30000,
  freeShipThreshold: 499000,
};

export function getSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_CONFIG };
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveSiteConfig(config: Partial<SiteConfig>): void {
  if (typeof window === 'undefined') return;
  const current = getSiteConfig();
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...current, ...config }));
}
