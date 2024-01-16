export const dateFormat = (date: Date): string => {
    
    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return new Intl.DateTimeFormat('es', dateOptions).format(date);
  };
  