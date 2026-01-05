import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import YandexMap from '@/components/YandexMap';
import HotelFilters, { HotelFilters as HotelFiltersType } from '@/components/HotelFilters';
import BookingDialog from '@/components/BookingDialog';

const Index = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hotelFilters, setHotelFilters] = useState<HotelFiltersType>({
    priceRange: [0, 50000],
    minRating: 0,
    amenities: [],
  });

  const categories = [
    { id: 'all', name: 'Все', icon: 'Sparkles' },
    { id: 'nature', name: 'Природа', icon: 'Mountain' },
    { id: 'beach', name: 'Пляжи', icon: 'Waves' },
    { id: 'culture', name: 'Культура', icon: 'Landmark' },
    { id: 'food', name: 'Кухня', icon: 'UtensilsCrossed' },
  ];

  const attractions = [
    {
      id: 1,
      name: 'Олимпийский парк',
      category: 'culture',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38',
      description: 'Наследие Олимпиады-2014',
      tags: ['Спорт', 'История', 'Архитектура'],
      coords: [43.402981, 39.955781] as [number, number],
    },
    {
      id: 2,
      name: 'Роза Хутор',
      category: 'nature',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
      description: 'Горнолыжный курорт',
      tags: ['Горы', 'Активный отдых', 'Природа'],
      coords: [43.739022, 40.314606] as [number, number],
    },
    {
      id: 3,
      name: 'Пляж Ривьера',
      category: 'beach',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      description: 'Лучший городской пляж',
      tags: ['Море', 'Отдых', 'Семья'],
      coords: [43.588947, 39.720952] as [number, number],
    },
    {
      id: 4,
      name: 'Агурские водопады',
      category: 'nature',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9',
      description: 'Живописные водопады',
      tags: ['Природа', 'Треккинг', 'Фото'],
      coords: [43.552778, 39.827222] as [number, number],
    },
    {
      id: 5,
      name: 'Скайпарк',
      category: 'culture',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      description: 'Экстрим и панорамы',
      tags: ['Развлечения', 'Адреналин', 'Виды'],
      coords: [43.564167, 39.956389] as [number, number],
    },
    {
      id: 6,
      name: 'Дагомысские чайные плантации',
      category: 'food',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256',
      description: 'Северная чайная столица',
      tags: ['Чай', 'Традиции', 'Гастрономия'],
      coords: [43.668611, 39.665833] as [number, number],
    },
  ];

  const hotels = [
    {
      id: 1,
      name: 'Radisson Blu Resort',
      rating: 4.8,
      price: 12500,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      location: 'Адлерский район',
      amenities: ['wifi', 'pool', 'spa', 'restaurant'],
      amenitiesDisplay: ['Wi-Fi', 'Бассейн', 'СПА', 'Ресторан'],
    },
    {
      id: 2,
      name: 'Swissotel Сочи Камелия',
      rating: 4.9,
      price: 15000,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      location: 'Центральный район',
      amenities: ['wifi', 'beach', 'fitness', 'parking'],
      amenitiesDisplay: ['Wi-Fi', 'Пляж', 'Фитнес', 'Парковка'],
    },
    {
      id: 3,
      name: 'Hyatt Regency Sochi',
      rating: 4.7,
      price: 10000,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      location: 'Олимпийский парк',
      amenities: ['wifi', 'pool', 'bar'],
      amenitiesDisplay: ['Wi-Fi', 'Бассейн', 'Бар'],
    },
    {
      id: 4,
      name: 'Pullman Sochi Centre',
      rating: 4.6,
      price: 8500,
      image: 'https://images.unsplash.com/photo-1455587734955-081b22074882',
      location: 'Центральный район',
      amenities: ['wifi', 'restaurant', 'parking', 'fitness'],
      amenitiesDisplay: ['Wi-Fi', 'Ресторан', 'Парковка', 'Фитнес'],
    },
    {
      id: 5,
      name: 'Mercure Sochi Centre',
      rating: 4.5,
      price: 7000,
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
      location: 'Центральный район',
      amenities: ['wifi', 'bar', 'parking'],
      amenitiesDisplay: ['Wi-Fi', 'Бар', 'Парковка'],
    },
    {
      id: 6,
      name: 'Bogatyr Hotel',
      rating: 4.8,
      price: 14000,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
      location: 'Адлерский район',
      amenities: ['wifi', 'pool', 'spa', 'beach', 'restaurant'],
      amenitiesDisplay: ['Wi-Fi', 'Бассейн', 'СПА', 'Пляж', 'Ресторан'],
    },
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
      const matchesSearch = !searchQuery.trim() || 
                           hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesRating && matchesAmenities && matchesSearch;
    });
  }, [hotelFilters, searchQuery]);

  const favoriteAttractions = useMemo(() => {
    return attractions.filter(a => favorites.includes(a.id));
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const mapLocations = attractions.map(a => ({
    id: a.id,
    name: a.name,
    coords: a.coords,
    description: a.description,
    category: a.category,
  }));

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
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={() => setActiveTab('profile')}
            >
              <Icon name="User" size={24} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Поиск мест, отелей, активностей..." 
              className="pl-10 bg-white/95 backdrop-blur-sm border-0 h-12 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm p-1 h-auto rounded-xl">
            <TabsTrigger value="explore" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Icon name="Compass" size={20} />
              <span className="text-xs">Исследовать</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Icon name="Hotel" size={20} />
              <span className="text-xs">Отели</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Icon name="MapPin" size={20} />
              <span className="text-xs">Карта</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg">
              <Icon name="Heart" size={20} />
              <span className="text-xs">Избранное</span>
              {favorites.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {favorites.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6 animate-fade-in">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">🔥 Персональные рекомендации</h2>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Icon name="Settings" size={16} className="mr-1" />
                  Настроить
                </Button>
              </div>
              <Card className="bg-gradient-to-br from-orange-400 to-pink-500 text-white border-0 shadow-xl hover-scale cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="Sparkles" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">Для любителей активного отдыха</h3>
                      <p className="text-sm text-white/90 mb-3">На основе ваших предпочтений мы подобрали маршрут: Роза Хутор → Агурские водопады → Скайпарк</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="bg-white text-orange-600 hover:bg-white/90"
                        onClick={() => setActiveTab('map')}
                      >
                        Посмотреть маршрут
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4">Категории</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl transition-all ${
                      selectedCategory === cat.id 
                        ? 'gradient-bg text-white border-0 shadow-lg' 
                        : 'bg-white hover:bg-gray-50 hover-scale'
                    }`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <Icon name={cat.icon as any} size={18} />
                    {cat.name}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {searchQuery ? `Результаты поиска (${filteredAttractions.length})` : 'Популярные места'}
                </h2>
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Очистить
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAttractions.map((attraction, index) => (
                  <Card 
                    key={attraction.id} 
                    className="overflow-hidden hover-scale border-0 shadow-lg bg-white cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={attraction.image} 
                        alt={attraction.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-md">
                          <Icon name="Star" size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                          {attraction.rating}
                        </Badge>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={`absolute top-3 left-3 backdrop-blur-sm ${
                          favorites.includes(attraction.id)
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                        onClick={() => toggleFavorite(attraction.id)}
                      >
                        <Icon name="Heart" size={20} className={favorites.includes(attraction.id) ? 'fill-white' : ''} />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{attraction.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{attraction.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {attraction.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredAttractions.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">Ничего не найдено</h3>
                  <p className="text-gray-600">Попробуйте изменить поисковый запрос или фильтры</p>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <HotelFilters filters={hotelFilters} onChange={setHotelFilters} />
              </div>
              
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Отели Сочи {filteredHotels.length > 0 && `(${filteredHotels.length})`}
                  </h2>
                  <div className="md:hidden">
                    <HotelFilters filters={hotelFilters} onChange={setHotelFilters} />
                  </div>
                </div>

                {filteredHotels.map((hotel, index) => (
                  <Card 
                    key={hotel.id} 
                    className="overflow-hidden hover-scale border-0 shadow-lg bg-white"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
                        <img 
                          src={hotel.image} 
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className={`absolute top-3 right-3 backdrop-blur-sm ${
                            favorites.includes(hotel.id)
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-white/20 hover:bg-white/30 text-white'
                          }`}
                          onClick={() => toggleFavorite(hotel.id)}
                        >
                          <Icon name="Heart" size={20} className={favorites.includes(hotel.id) ? 'fill-white' : ''} />
                        </Button>
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Icon name="MapPin" size={14} />
                              {hotel.location}
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                            <Icon name="Star" size={14} className="mr-1" />
                            {hotel.rating}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 my-3">
                          {hotel.amenitiesDisplay.map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <div>
                            <div className="text-2xl font-bold gradient-text">
                              {hotel.price.toLocaleString('ru-RU')} ₽
                            </div>
                            <div className="text-xs text-gray-500">за ночь</div>
                          </div>
                          <BookingDialog hotel={hotel} />
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}

                {filteredHotels.length === 0 && (
                  <div className="text-center py-12">
                    <Icon name="SearchX" size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">Отели не найдены</h3>
                    <p className="text-gray-600 mb-4">Попробуйте изменить фильтры или поисковый запрос</p>
                    <Button 
                      onClick={() => setHotelFilters({ priceRange: [0, 50000], minRating: 0, amenities: [] })}
                    >
                      Сбросить фильтры
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map" className="animate-fade-in">
            <Card className="border-0 shadow-lg overflow-hidden">
              <YandexMap locations={mapLocations} onLocationClick={(location) => {
                console.log('Clicked:', location);
                setActiveTab('explore');
                const attraction = attractions.find(a => a.id === location.id);
                if (attraction) {
                  setSelectedCategory(attraction.category);
                }
              }} />
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                    ТГ
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Турист Гид</h2>
                    <p className="text-gray-600">turист@example.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-2xl font-bold gradient-text">12</div>
                    <div className="text-sm text-gray-600">Посещено</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl">
                    <div className="text-2xl font-bold gradient-text">{favorites.length}</div>
                    <div className="text-sm text-gray-600">Избранное</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                    <div className="text-2xl font-bold gradient-text">3</div>
                    <div className="text-sm text-gray-600">Бронирования</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white hover-scale">
                    <Icon name="History" size={20} className="mr-3" />
                    История посещений
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white hover-scale">
                    <Icon name="Calendar" size={20} className="mr-3" />
                    Мои бронирования
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white hover-scale">
                    <Icon name="Settings" size={20} className="mr-3" />
                    Настройки предпочтений
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white hover-scale">
                    <Icon name="Bell" size={20} className="mr-3" />
                    Уведомления
                  </Button>
                </div>
              </CardContent>
            </Card>

            {favoriteAttractions.length > 0 && (
              <Card className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Избранные места</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteAttractions.map((attraction) => (
                      <Card 
                        key={attraction.id} 
                        className="overflow-hidden hover-scale border cursor-pointer"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={attraction.image} 
                            alt={attraction.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-bold text-sm mb-1">{attraction.name}</h4>
                          <p className="text-xs text-gray-600">{attraction.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
