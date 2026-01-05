import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBooking();
  
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState('standard');
  const [mealPlan, setMealPlan] = useState<'none' | 'breakfast' | 'halfBoard' | 'fullBoard'>('breakfast');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * hotel.price;
  };

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!checkIn) newErrors.checkIn = 'Выберите дату заезда';
    if (!checkOut) newErrors.checkOut = 'Выберите дату выезда';
    if (checkIn && checkOut && checkIn >= checkOut) {
      newErrors.checkOut = 'Дата выезда должна быть позже даты заезда';
    }
    if (!name.trim()) newErrors.name = 'Введите ФИО';
    if (!email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email должен содержать @ и домен';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Введите телефон';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Телефон должен содержать 11 цифр';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = () => {
    if (!validateForm()) {
      toast.error('Проверьте правильность заполнения полей');
      return;
    }

    if (!user) {
      toast.error('Для бронирования необходимо войти в систему');
      navigate('/login');
      return;
    }

    const id = addBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkIn: checkIn!.toISOString(),
      checkOut: checkOut!.toISOString(),
      guests,
      roomType: roomType === 'standard' ? 'Стандарт' : roomType === 'deluxe' ? 'Делюкс' : 'Люкс',
      mealPlan,
      totalPrice: calculateTotal(),
      status: 'confirmed',
      guestName: name,
      guestEmail: email,
      guestPhone: phone,
    });

    setBookingId(id);
    setOpen(false);
    setConfirmDialogOpen(true);

    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(2);
    setRoomType('standard');
    setMealPlan('breakfast');
    if (!user) {
      setName('');
      setEmail('');
      setPhone('');
    }
    setErrors({});
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomType">Тип номера</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандарт</SelectItem>
                  <SelectItem value="deluxe">Делюкс (+20%)</SelectItem>
                  <SelectItem value="suite">Люкс (+50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mealPlan">Питание</Label>
              <Select value={mealPlan} onValueChange={(v) => setMealPlan(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без питания</SelectItem>
                  <SelectItem value="breakfast">Завтрак</SelectItem>
                  <SelectItem value="halfBoard">Полупансион</SelectItem>
                  <SelectItem value="fullBoard">Полный пансион</SelectItem>
                </SelectContent>
              </Select>
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
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ivan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (900) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
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

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle2" size={32} className="text-green-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Бронирование подтверждено!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-3 pt-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-left">
                <p className="font-semibold text-gray-900">
                  Бронирование отеля "{hotel.name}"
                </p>
                <p className="text-sm">
                  <strong>Даты:</strong> {checkIn && format(checkIn, 'dd.MM.yyyy', { locale: ru })} - {checkOut && format(checkOut, 'dd.MM.yyyy', { locale: ru })}
                </p>
                <p className="text-sm">
                  <strong>Гостей:</strong> {guests}
                </p>
                <p className="text-sm">
                  <strong>Номер брони:</strong> <span className="font-mono">{bookingId}</span>
                </p>
              </div>
              <p className="text-sm">
                Подтверждение отправлено на email <strong>{email}</strong>
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Закрыть
            </Button>
            <Button
              onClick={() => {
                setConfirmDialogOpen(false);
                navigate('/profile');
              }}
              className="w-full sm:w-auto"
            >
              Посмотреть бронирования
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BookingDialog;