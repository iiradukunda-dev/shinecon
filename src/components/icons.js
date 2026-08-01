'use client';

import {
  Home, Wallet, Target, ClipboardCheck, Megaphone, Sparkles,
  User, Users, LineChart, Calendar, MessageSquare, FileText,
  Settings, ShieldCheck, DollarSign, Hourglass, Church, Download,
  Eye, Sun, Clock, MapPin, CheckCircle, XCircle, Info, Menu, X,
  Star, Check, Globe, Moon, Smartphone, History, BarChart,
  Clipboard, PartyPopper, Bell, Lightbulb, Heart, Gift, Plane,
  Music, Tent, AlertCircle, Hammer, Gem, ClipboardList, BarChart2,
} from 'lucide-react';

/** Map emoji shortcuts → Lucide components */
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

/** Map CSS variable strings → hex values for lucide stroke colors */
const colorMap = {
  'var(--soft-red)': '#E03131',
  'var(--gold)': '#D4A843',
  'var(--gold-light)': '#E8C876',
  'var(--emerald)': '#2B8A3E',
  'var(--royal-blue)': '#3B5BDB',
  'var(--white)': '#FFFFFF',
  'var(--text-primary)': '#FFFFFF',
  'var(--text-secondary)': '#CCCCCC',
};

/** Map icon name strings → Lucide React components */
const iconComponents = {
  'home': Home,
  'wallet': Wallet,
  'target': Target,
  'clipboard-check': ClipboardCheck,
  'megaphone': Megaphone,
  'sparkles': Sparkles,
  'user': User,
  'users': Users,
  'line-chart': LineChart,
  'calendar': Calendar,
  'message-square': MessageSquare,
  'file-text': FileText,
  'settings': Settings,
  'shield-check': ShieldCheck,
  'dollar-sign': DollarSign,
  'hourglass': Hourglass,
  'church': Church,
  'download': Download,
  'eye': Eye,
  'sun': Sun,
  'clock': Clock,
  'map-pin': MapPin,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'info': Info,
  'menu': Menu,
  'x': X,
  'star': Star,
  'check': Check,
  'globe': Globe,
  'moon': Moon,
  'smartphone': Smartphone,
  'history': History,
  'bar-chart': BarChart,
  'bar-chart-2': BarChart2,
  'clipboard': Clipboard,
  'clipboard-list': ClipboardList,
  'party-popper': PartyPopper,
  'bell': Bell,
  'lightbulb': Lightbulb,
  'heart': Heart,
  'gift': Gift,
  'plane': Plane,
  'music': Music,
  'tent': Tent,
  'alert-circle': AlertCircle,
  'hammer': Hammer,
  'gem': Gem,
};

/**
 * Resolves color prop to a CSS-usable color string.
 * Accepts CSS variables, hex (with or without #), or any CSS color.
 */
function resolveColor(color) {
  if (!color) return '#D4A843';
  if (colorMap[color]) return colorMap[color];
  if (color.startsWith('var(')) return '#D4A843'; // unknown var fallback
  if (color.startsWith('#')) return color;
  return `#${color}`; // bare hex like "D4A843"
}

/**
 * Universal offline icon component.
 * - Accepts icon names (e.g. "wallet"), emoji shortcuts, or is ignored for URLs.
 * - Falls back to a ● dot if the icon name is unrecognised.
 */
export function OnlineLogoIcon({ name, color = 'D4A843', size = 20, className = '' }) {
  const mappedName = emojiMap[name] || name;

  // If it's a URL, render a plain img tag (external logos like payment provider logos)
  if (String(mappedName).startsWith('http')) {
    return (
      <img
        src={mappedName}
        alt={name}
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          filter: 'drop-shadow(0 0 2px rgba(212, 168, 67, 0.3))',
        }}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  }

  const LucideIcon = iconComponents[mappedName];
  const stroke = resolveColor(color);

  if (!LucideIcon) {
    // Graceful fallback: small colored dot
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          background: stroke,
          verticalAlign: 'middle',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <LucideIcon
      size={size}
      color={stroke}
      strokeWidth={1.75}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        filter: 'drop-shadow(0 0 2px rgba(212, 168, 67, 0.3))',
      }}
    />
  );
}

/* ── Named icon exports (unchanged API) ──────────────────── */

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
