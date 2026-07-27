'use client';

const emojiMap = {
  '📢': 'megaphone',
  '⛪': 'church',
  '👥': 'users',
  '⛺': 'tent',
  '⭐': 'star',
  '🎶': 'music',
  '🔔': 'bell',
  '💡': 'lightbulb',
  '🎉': 'party-popper',
  '❤️': 'heart',
  '💰': 'wallet',
  '🏛️': 'church',
  '📋': 'clipboard-list',
  '📊': 'bar-chart-2',
  '🎯': 'target',
  '💎': 'gem',
  '🏗️': 'hammer',
  '🌟': 'star',
  '🎵': 'music',
  '✈️': 'plane',
  '🎁': 'gift',
};

const colorMap = {
  'var(--soft-red)': 'E03131',
  'var(--gold)': 'D4A843',
  'var(--gold-light)': 'E8C876',
  'var(--emerald)': '2B8A3E',
  'var(--royal-blue)': '3B5BDB',
  'var(--white)': 'FFFFFF',
  'var(--text-primary)': 'FFFFFF',
  'var(--text-secondary)': 'CCCCCC'
};

export function OnlineLogoIcon({ name, color = 'D4A843', size = 20, className = '' }) {
  const mappedName = emojiMap[name] || name;
  const isUrl = String(mappedName).startsWith('http');
  
  let cleanColor = colorMap[color] || color.replace('#', '');
  if (cleanColor.includes('var(')) cleanColor = 'D4A843'; // fallback for unknown vars
  
  const iconUrl = isUrl ? mappedName : `https://api.iconify.design/lucide:${mappedName}.svg?color=%23${cleanColor}`;

  return (
    <img
      src={iconUrl}
      alt={name}
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 0 2px rgba(212, 168, 67, 0.3))'
      }}
      className={className}
    />
  );
}

export function IconHome({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="home" color={color} size={size} className={className} />;
}

export function IconGive({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="wallet" color={color} size={size} className={className} />;
}

export function IconTarget({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="target" color={color} size={size} className={className} />;
}

export function IconClipboard({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="clipboard-check" color={color} size={size} className={className} />;
}

export function IconMegaphone({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="megaphone" color={color} size={size} className={className} />;
}

export function IconSparkles({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="sparkles" color={color} size={size} className={className} />;
}

export function IconUser({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="user" color={color} size={size} className={className} />;
}

export function IconUsers({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="users" color={color} size={size} className={className} />;
}

export function IconChart({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="line-chart" color={color} size={size} className={className} />;
}

export function IconCalendar({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="calendar" color={color} size={size} className={className} />;
}

export function IconMessage({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="message-square" color={color} size={size} className={className} />;
}

export function IconFileText({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="file-text" color={color} size={size} className={className} />;
}

export function IconSettings({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="settings" color={color} size={size} className={className} />;
}

export function IconShield({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="shield-check" color={color} size={size} className={className} />;
}

export function IconDollar({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="dollar-sign" color={color} size={size} className={className} />;
}

export function IconHourglass({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="hourglass" color={color} size={size} className={className} />;
}

export function IconChurch({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="church" color={color} size={size} className={className} />;
}

export function IconDownload({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="download" color={color} size={size} className={className} />;
}

export function IconEye({ size = 20, color = 'D4A843', className = '' }) {
  return <OnlineLogoIcon name="eye" color={color} size={size} className={className} />;
}
