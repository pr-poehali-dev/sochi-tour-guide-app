import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { hotels } from '@/data/hotels';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  const { favorites, toggleFavorite } = useFavorites();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [activities, setActivities] = useState<string[]>(user?.preferences?.activities || []);
  const [budget, setBudget] = useState(user?.preferences?.budget || 'medium');
  const [travelStyle, setTravelStyle] = useState(user?.preferences?.travelStyle || 'relaxing');

  if (!user) {
    navigate('/login');
    return null;
  }

  const userBookings = getUserBookings();
  const favoriteHotels = hotels.filter(h => favorites.includes(h.id));

  const handleSaveProfile = () => {
    updateUser({
      name,
      phone,
      preferences: {
        activities,
        budget: budget as 'economy' | 'medium' | 'premium',
        travelStyle: travelStyle as 'family' | 'romantic' | 'active' | 'relaxing',
      },
    });
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="gradient-bg text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Личный кабинет</h1>
              <p className="text-sm text-white/80">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">
              <Icon name="Calendar" size={16} className="mr-2" />
              Мои бронирования
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Icon name="Heart" size={16} className="mr-2" />
              Избранное
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            {userBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Icon name="Calendar" size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">У вас пока нет бронирований</p>
                  <Button onClick={() => navigate('/')} className="mt-4">
                    Найти отель
                  </Button>
                </CardContent>
              </Card>
            ) : (
              userBookings.map(booking => (
                <Card key={booking.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{booking.hotelName}</h3>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status === 'confirmed' ? 'Подтверждено' : 'Отменено'}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} />
                            <span>
                              {new Date(booking.checkIn).toLocaleDateString('ru')} - {new Date(booking.checkOut).toLocaleDateString('ru')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Users" size={16} />
                            <span>{booking.guests} {booking.guests === 1 ? 'гость' : 'гостей'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="BedDouble" size={16} />
                            <span>{booking.roomType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Hash" size={16} />
                            <span className="font-mono">{booking.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {booking.totalPrice.toLocaleString('ru')} ₽
                        </div>
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => cancelBooking(booking.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Отменить
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favoriteHotels.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Icon name="Heart" size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">У вас пока нет избранных отелей</p>
                  <Button onClick={() => navigate('/')} className="mt-4">
                    Найти отели
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteHotels.map(hotel => (
                  <Card key={hotel.id} className="hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(hotel.id)}
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                        >
                          <Icon name="Heart" size={20} className="text-red-500 fill-red-500" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{hotel.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{hotel.location}</span>
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          {hotel.price.toLocaleString('ru')} ₽
                          <span className="text-sm font-normal text-gray-500"> / ночь</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Личные данные</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 (900) 123-45-67"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Предпочтения</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-3 block">Любимые активности</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Горы', 'Пляж', 'Экскурсии', 'СПА', 'Спорт', 'Культура'].map(activity => (
                          <Badge
                            key={activity}
                            variant={activities.includes(activity) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleActivity(activity)}
                          >
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Бюджет</Label>
                      <div className="flex gap-2">
                        {[
                          { value: 'economy', label: 'Эконом' },
                          { value: 'medium', label: 'Средний' },
                          { value: 'premium', label: 'Премиум' },
                        ].map(option => (
                          <Badge
                            key={option.value}
                            variant={budget === option.value ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setBudget(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Стиль путешествий</Label>
                      <div className="flex gap-2">
                        {[
                          { value: 'family', label: 'Семейный' },
                          { value: 'romantic', label: 'Романтический' },
                          { value: 'active', label: 'Активный' },
                          { value: 'relaxing', label: 'Спокойный' },
                        ].map(option => (
                          <Badge
                            key={option.value}
                            variant={travelStyle === option.value ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => setTravelStyle(option.value)}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
