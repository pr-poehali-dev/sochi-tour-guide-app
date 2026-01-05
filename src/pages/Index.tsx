import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import YandexMap from '@/components/YandexMap';
import HotelFiltersComponent, { HotelFilters as HotelFiltersType } from '@/components/HotelFilters';
import BookingDialog from '@/components/BookingDialog';
import { hotels } from '@/data/hotels';
import { attractions } from '@/data/attractions';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useBooking } from '@/contexts/BookingContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addBooking } = useBooking();
  
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hotelFilters, setHotelFilters] = useState<HotelFiltersType>({
    priceRange: [0, 50000],
    minRating: 0,
    amenities: [],
    stars: [],
    districts: [],
    types: [],
  });

  const categories = [
    { id: 'all', name: 'Все', icon: 'Sparkles' },
    { id: 'nature', name: 'Природа', icon: 'Mountain' },
    { id: 'beach', name: 'Пляжи', icon: 'Waves' },
    { id: 'culture', name: 'Культура', icon: 'Landmark' },
    { id: 'food', name: 'Кухня', icon: 'UtensilsCrossed' },
    { id: 'active', name: 'Активный отдых', icon: 'Zap' },
    { id: 'family', name: 'Для семьи', icon: 'Users' },
    { id: 'romantic', name: 'Романтика', icon: 'Heart' },
    { id: 'adventure', name: 'Приключения', icon: 'Compass' },
    { id: 'relax', name: 'Релакс', icon: 'Coffee' },
    { id: 'hiking', name: 'Походы', icon: 'Footprints' },
    { id: 'diving', name: 'Дайвинг', icon: 'Fish' },
    { id: 'skiing', name: 'Горные лыжи', icon: 'Mountain' },
    { id: 'spa', name: 'СПА', icon: 'Sparkles' },
    { id: 'parks', name: 'Парки', icon: 'Trees' },
    { id: 'museums', name: 'Музеи', icon: 'Building' },
    { id: 'theater', name: 'Театр', icon: 'Drama' },
    { id: 'nightlife', name: 'Ночная жизнь', icon: 'Moon' },
    { id: 'shopping', name: 'Шопинг', icon: 'ShoppingBag' },
    { id: 'waterfalls', name: 'Водопады', icon: 'Waves' },
    { id: 'caves', name: 'Пещеры', icon: 'Mountain' },
    { id: 'viewpoints', name: 'Смотровые', icon: 'Eye' },
    { id: 'historical', name: 'История', icon: 'Clock' },
    { id: 'architecture', name: 'Архитектура', icon: 'Building2' },
    { id: 'gardens', name: 'Сады', icon: 'Flower' },
    { id: 'zoo', name: 'Зоопарк', icon: 'PawPrint' },
    { id: 'aquarium', name: 'Океанариум', icon: 'Fish' },
    { id: 'amusement', name: 'Развлечения', icon: 'Rocket' },
    { id: 'sports', name: 'Спорт', icon: 'Activity' },
    { id: 'wellness', name: 'Здоровье', icon: 'Heart' },
    { id: 'wine', name: 'Вино', icon: 'Wine' },
    { id: 'coffee', name: 'Кофейни', icon: 'Coffee' },
    { id: 'seafood', name: 'Морепродукты', icon: 'Fish' },
    { id: 'traditional', name: 'Традиционная', icon: 'UtensilsCrossed' },
    { id: 'asian', name: 'Азиатская', icon: 'UtensilsCrossed' },
    { id: 'european', name: 'Европейская', icon: 'UtensilsCrossed' },
    { id: 'street', name: 'Уличная еда', icon: 'Sandwich' },
    { id: 'photography', name: 'Фотозоны', icon: 'Camera' },
    { id: 'sunrise', name: 'Рассветы', icon: 'Sunrise' },
    { id: 'sunset', name: 'Закаты', icon: 'Sunset' },
    { id: 'bike', name: 'Велопрогулки', icon: 'Bike' },
    { id: 'boat', name: 'Морские прогулки', icon: 'Ship' },
    { id: 'fishing', name: 'Рыбалка', icon: 'Fish' },
    { id: 'climbing', name: 'Скалолазание', icon: 'Mountain' },
    { id: 'rafting', name: 'Рафтинг', icon: 'Waves' },
    { id: 'paragliding', name: 'Параплан', icon: 'PlaneTakeoff' },
    { id: 'horseback', name: 'Конные прогулки', icon: 'Horse' },
    { id: 'yoga', name: 'Йога', icon: 'User' },
    { id: 'meditation', name: 'Медитация', icon: 'Sparkles' },
    { id: 'festivals', name: 'Фестивали', icon: 'PartyPopper' },
  ];

  const filteredAttractions = useMemo(() => {
    let results = attractions;
    
    if (selectedCategory !== 'all') {
      results = results.filter(a => a.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return results;
  }, [selectedCategory, searchQuery]);

  const filteredHotels = useMemo(() => {
    return hotels.filter(hotel => {
      const matchesPrice = hotel.price >= hotelFilters.priceRange[0] && 
                          hotel.price <= hotelFilters.priceRange[1];
      const matchesRating = hotel.rating >= hotelFilters.minRating;
      const matchesAmenities = hotelFilters.amenities.length === 0 || 
                               hotelFilters.amenities.every(a => hotel.amenities.includes(a));
      const matchesStars = hotelFilters.stars.length === 0 || 
                          hotelFilters.stars.includes(hotel.stars);
      const matchesDistricts = hotelFilters.districts.length === 0 || 
                              hotelFilters.districts.includes(hotel.district);
      const matchesTypes = hotelFilters.types.length === 0 || 
                          hotelFilters.types.includes(hotel.type);
      const matchesSearch = !searchQuery.trim() || 
                           hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesRating && matchesAmenities && matchesStars && 
             matchesDistricts && matchesTypes && matchesSearch;
    });
  }, [hotelFilters, searchQuery]);

  const favoriteAttractions = useMemo(() => {
    return attractions.filter(a => isFavorite(a.id));
  }, [favorites]);

  const favoriteHotels = useMemo(() => {
    return hotels.filter(h => isFavorite(h.id));
  }, [favorites]);

  const recommendedHotels = useMemo(() => {
    if (!user || !user.preferences) return hotels.slice(0, 6);
    
    const { budget, travelStyle, activities } = user.preferences;
    
    const scored = hotels.map(hotel => {
      let score = 0;
      
      if (budget === 'economy' && hotel.price <= 6000) score += 3;
      if (budget === 'medium' && hotel.price > 6000 && hotel.price <= 12000) score += 3;
      if (budget === 'premium' && hotel.price > 12000) score += 3;
      
      if (travelStyle === 'family' && hotel.amenities.includes('pool')) score += 2;
      if (travelStyle === 'romantic' && hotel.type === 'resort') score += 2;
      if (travelStyle === 'active' && hotel.district === 'krasnaya-polyana') score += 2;
      if (travelStyle === 'relaxing' && hotel.amenities.includes('spa')) score += 2;
      
      if (activities.includes('Горы') && hotel.district === 'krasnaya-polyana') score += 2;
      if (activities.includes('Пляж') && hotel.amenities.includes('beach')) score += 2;
      if (activities.includes('Спорт') && hotel.amenities.includes('fitness')) score += 1;
      if (activities.includes('Шопинг') && hotel.district === 'center') score += 1;
      if (activities.includes('Культура') && hotel.district === 'center') score += 1;
      if (activities.includes('Гастрономия') && hotel.amenities.includes('restaurant')) score += 1;
      
      score += hotel.rating;
      
      return { ...hotel, score };
    });
    
    return scored.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [user]);

  const recommendedAttractions = useMemo(() => {
    if (!user || !user.preferences) return attractions.slice(0, 4);
    
    const { travelStyle, activities } = user.preferences;
    
    const scored = attractions.map(attraction => {
      let score = 0;
      
      if (travelStyle === 'family' && attraction.tags.includes('Семья')) score += 2;
      if (travelStyle === 'romantic' && (attraction.category === 'beach' || attraction.tags.includes('Виды'))) score += 2;
      if (travelStyle === 'active' && (attraction.category === 'nature' || attraction.tags.includes('Активный отдых'))) score += 2;
      if (travelStyle === 'relaxing' && (attraction.category === 'beach' || attraction.tags.includes('Отдых'))) score += 2;
      
      if (activities.includes('Горы') && attraction.tags.includes('Горы')) score += 2;
      if (activities.includes('Пляж') && attraction.category === 'beach') score += 2;
      if (activities.includes('Культура') && attraction.category === 'culture') score += 2;
      if (activities.includes('Гастрономия') && attraction.category === 'food') score += 2;
      
      score += attraction.rating;
      
      return { ...attraction, score };
    });
    
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [user]);

  const mapLocations = [
    ...attractions.map(a => ({
      id: a.id,
      name: a.name,
      coords: a.coords,
      description: a.description,
      category: a.category,
    })),
    ...hotels.map(h => ({
      id: h.id + 1000,
      name: h.name,
      coords: h.coords,
      description: `${h.description} | ${h.price.toLocaleString('ru-RU')} ₽/ночь | Рейтинг: ${h.rating}`,
      category: 'hotel',
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="gradient-bg text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Icon name="Map" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Сочи Гид</h1>
                <p className="text-sm text-white/80">Твой умный путеводитель</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white/20 border-white/30 hover:bg-white/30 text-white">
                      <Icon name="User" size={18} className="mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Icon name="User" size={16} className="mr-2" />
                      Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/bookings')}>
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Мои бронирования
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="bg-white/20 border-white/30 hover:bg-white/30 text-white"
                    onClick={() => navigate('/login')}
                  >
                    <Icon name="LogIn" size={18} className="mr-2" />
                    Войти
                  </Button>
                  <Button 
                    className="bg-white text-purple-600 hover:bg-white/90"
                    onClick={() => navigate('/register')}
                  >
                    <Icon name="UserPlus" size={18} className="mr-2" />
                    Регистрация
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск мест и отелей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 bg-white/95 backdrop-blur-sm border-0 rounded-xl text-gray-800 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white/50"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-md">
            <TabsTrigger value="explore" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Icon name="Compass" size={18} />
              <span className="hidden sm:inline">Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Icon name="Hotel" size={18} />
              <span className="hidden sm:inline">Отели</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Icon name="Map" size={18} />
              <span className="hidden sm:inline">Карта</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg">
              <Icon name="Heart" size={18} />
              <span className="hidden sm:inline">Избранное</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            {user && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Sparkles" size={24} className="text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Рекомендации для вас</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Icon name="MapPin" size={18} />
                      Места для посещения
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendedAttractions.map(attraction => (
                        <Card key={attraction.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0">
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={attraction.image} 
                              alt={attraction.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-xs">{attraction.rating}</span>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-bold text-sm mb-1 text-gray-800 line-clamp-1">{attraction.name}</h4>
                            <p className="text-gray-600 text-xs line-clamp-2">{attraction.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Icon name="Hotel" size={18} />
                      Отели по вашим предпочтениям
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedHotels.map(hotel => (
                        <Card key={hotel.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0">
                          <div className="relative h-40 overflow-hidden">
                            <img 
                              src={hotel.image} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Icon name="Star" size={12} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-xs">{hotel.rating}</span>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-purple-600 text-white text-xs">
                                {'★'.repeat(hotel.stars || 3)}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-bold text-sm mb-1 text-gray-800 line-clamp-1">{hotel.name}</h4>
                            <p className="text-gray-600 text-xs mb-2">{hotel.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-purple-600 font-bold text-sm">{hotel.price.toLocaleString('ru-RU')} ₽</span>
                              <BookingDialog hotel={hotel} onBook={(bookingData) => addBooking(bookingData)} />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90' 
                      : 'bg-white/80 hover:bg-white'
                  }`}
                >
                  <Icon name={cat.icon as any} size={18} />
                  {cat.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttractions.map(attraction => (
                <Card key={attraction.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(attraction.id)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
                    >
                      <Icon 
                        name="Heart" 
                        size={18} 
                        className={isFavorite(attraction.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                      />
                    </Button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-sm">{attraction.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{attraction.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {attraction.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <HotelFiltersComponent filters={hotelFilters} onChange={setHotelFilters} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <Card key={hotel.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={hotel.image} 
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(hotel.id)}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
                    >
                      <Icon 
                        name="Heart" 
                        size={18} 
                        className={isFavorite(hotel.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                      />
                    </Button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-sm">{hotel.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-1 text-gray-800">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {hotel.location}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenitiesDisplay.slice(0, 3).map(amenity => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {hotel.amenitiesDisplay.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hotel.amenitiesDisplay.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {hotel.price.toLocaleString('ru-RU')} ₽
                        </div>
                        <div className="text-xs text-gray-500">за ночь</div>
                      </div>
                      <BookingDialog hotel={hotel} onBook={addBooking}>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                          Забронировать
                        </Button>
                      </BookingDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <Icon name="SearchX" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Отели не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="Map" size={20} />
                Легенда карты
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-700">Отели</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-700">Природа</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-700">Пляжи</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-700">Культура</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-700">Еда</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-700">Активный отдых</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
                  <span className="text-sm text-gray-700">Водопады</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-700">Пещеры</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-700">Смотровые</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-sky-400"></div>
                  <span className="text-sm text-gray-700">Горные лыжи</span>
                </div>
              </div>
            </div>
            
            <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <YandexMap locations={mapLocations} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {!user ? (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Icon name="Heart" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Войдите, чтобы сохранять избранное</h3>
                  <p className="text-gray-600 mb-6">Создайте аккаунт или войдите, чтобы сохранять любимые места и отели</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => navigate('/login')} variant="outline">
                      Войти
                    </Button>
                    <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Зарегистрироваться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : favorites.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Icon name="Heart" size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Пока ничего не добавлено</h3>
                  <p className="text-gray-600">Добавляйте места и отели в избранное, нажимая на иконку сердца</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {favoriteAttractions.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Избранные места</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteAttractions.map(attraction => (
                        <Card key={attraction.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
                          <div className="relative h-56 overflow-hidden">
                            <img 
                              src={attraction.image} 
                              alt={attraction.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(attraction.id)}
                              className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
                            >
                              <Icon 
                                name="Heart" 
                                size={18} 
                                className="fill-red-500 text-red-500"
                              />
                            </Button>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-sm">{attraction.rating}</span>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">{attraction.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{attraction.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {attraction.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {favoriteHotels.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Избранные отели</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteHotels.map(hotel => (
                        <Card key={hotel.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0">
                          <div className="relative h-56 overflow-hidden">
                            <img 
                              src={hotel.image} 
                              alt={hotel.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFavorite(hotel.id)}
                              className="absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
                            >
                              <Icon 
                                name="Heart" 
                                size={18} 
                                className="fill-red-500 text-red-500"
                              />
                            </Button>
                            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold text-sm">{hotel.rating}</span>
                            </div>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-bold text-lg mb-1 text-gray-800">{hotel.name}</h3>
                            <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                              <Icon name="MapPin" size={14} />
                              {hotel.location}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {hotel.amenitiesDisplay.slice(0, 3).map(amenity => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {hotel.amenitiesDisplay.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{hotel.amenitiesDisplay.length - 3}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-purple-600">
                                  {hotel.price.toLocaleString('ru-RU')} ₽
                                </div>
                                <div className="text-xs text-gray-500">за ночь</div>
                              </div>
                              <BookingDialog hotel={hotel} onBook={addBooking}>
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                                  Забронировать
                                </Button>
                              </BookingDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;