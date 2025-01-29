'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('settings.theme');

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{t('light')}</SelectItem>
        <SelectItem value="dark">{t('dark')}</SelectItem>
        <SelectItem value="system">{t('system')}</SelectItem>
      </SelectContent>
    </Select>
  );
}