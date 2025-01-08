import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatRelativeTime(date: string | Date) {
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale: ko 
  });
}