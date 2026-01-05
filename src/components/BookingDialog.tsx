import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';

interface Hotel {
  id: number;
  name: string;
  price: number;
  rating: number;
  location: string;
}

interface BookingDialogProps {
  hotel: Hotel;
  children?: React.ReactNode;
}

const BookingDialog = ({ hotel, children }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * hotel.price;
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast.error('Выберите даты заезда и выезда');
      return;
    }
    if (!name || !email || !phone) {
      toast.error('Заполните все обязательные поля');
      return;
    }
    if (checkIn >= checkOut) {
      toast.error('Дата выезда должна быть позже даты заезда');
      return;
    }

    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    toast.success(
      `Бронирование подтверждено! 
      ${hotel.name} на ${nights} ${nights === 1 ? 'ночь' : nights < 5 ? 'ночи' : 'ночей'}.
      Сумма: ${calculateTotal().toLocaleString('ru-RU')} ₽`,
      { duration: 5000 }
    );

    setOpen(false);
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(2);
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="gradient-bg text-white border-0">
            Забронировать
            <Icon name="ArrowRight" size={16} className="ml-2" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Бронирование отеля</DialogTitle>
          <DialogDescription>
            {hotel.name} • {hotel.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkin">Дата заезда *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Icon name="CalendarDays" size={16} className="mr-2" />
                    {checkIn ? format(checkIn, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout">Дата выезда *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Icon name="CalendarDays" size={16} className="mr-2" />
                    {checkOut ? format(checkOut, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date < (checkIn || new Date())}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Количество гостей</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.max(1, guests - 1))}
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="text-lg font-semibold w-12 text-center">{guests}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.min(10, guests + 1))}
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">ФИО *</Label>
            <Input
              id="name"
              placeholder="Иванов Иван Иванович"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {checkIn && checkOut && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Количество ночей:</span>
                <span className="font-semibold">
                  {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Цена за ночь:</span>
                <span className="font-semibold">{hotel.price.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Итого:</span>
                <span className="gradient-text">{calculateTotal().toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          )}

          <Button 
            className="w-full gradient-bg text-white h-12 text-lg"
            onClick={handleBooking}
          >
            <Icon name="Check" size={20} className="mr-2" />
            Подтвердить бронирование
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
