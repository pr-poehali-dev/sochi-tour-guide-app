import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    },
    {
      id: 2,
      name: 'Роза Хутор',
      category: 'nature',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766',
      description: 'Горнолыжный курорт',
      tags: ['Горы', 'Активный отдых', 'Природа'],
    },
    {
      id: 3,
      name: 'Пляж Ривьера',
      category: 'beach',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      description: 'Лучший городской пляж',
      tags: ['Море', 'Отдых', 'Семья'],
    },
    {
      id: 4,
      name: 'Агурские водопады',
      category: 'nature',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9',
      description: 'Живописные водопады',
      tags: ['Природа', 'Треккинг', 'Фото'],
    },
    {
      id: 5,
      name: 'Скайпарк',
      category: 'culture',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      description: 'Экстрим и панорамы',
      tags: ['Развлечения', 'Адреналин', 'Виды'],
    },
    {
      id: 6,
      name: 'Дагомысские чайные плантации',
      category: 'food',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256',
      description: 'Северная чайная столица',
      tags: ['Чай', 'Традиции', 'Гастрономия'],
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
      amenities: ['Wi-Fi', 'Бассейн', 'СПА', 'Ресторан'],
    },
    {
      id: 2,
      name: 'Swissotel Сочи Камелия',
      rating: 4.9,
      price: 15000,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      location: 'Центральный район',
      amenities: ['Wi-Fi', 'Пляж', 'Фитнес', 'Парковка'],
    },
    {
      id: 3,
      name: 'Hyatt Regency Sochi',
      rating: 4.7,
      price: 10000,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      location: 'Олимпийский парк',
      amenities: ['Wi-Fi', 'Бассейн', 'Бар', 'Конференц-зал'],
    },
  ];

  const filteredAttractions = selectedCategory === 'all' 
    ? attractions 
    : attractions.filter(a => a.category === selectedCategory);

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
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Icon name="User" size={24} />
            </Button>
          </div>
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Поиск мест, отелей, активностей..." 
              className="pl-10 bg-white/95 backdrop-blur-sm border-0 h-12 rounded-xl"
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
              <Card className="bg-gradient-to-br from-orange-400 to-pink-500 text-white border-0 shadow-xl hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="Sparkles" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">Для любителей активного отдыха</h3>
                      <p className="text-sm text-white/90 mb-3">На основе ваших предпочтений мы подобрали маршрут: Роза Хутор → Агурские водопады → Скайпарк</p>
                      <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-white/90">
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
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl ${
                      selectedCategory === cat.id 
                        ? 'gradient-bg text-white border-0' 
                        : 'bg-white hover:bg-gray-50'
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
              <h2 className="text-xl font-bold mb-4">Популярные места</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAttractions.map((attraction, index) => (
                  <Card 
                    key={attraction.id} 
                    className="overflow-hidden hover-scale border-0 shadow-lg bg-white"
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
                        className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                      >
                        <Icon name="Heart" size={20} />
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
            </section>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6 animate-fade-in">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Отели Сочи</h2>
                <Button variant="outline" size="sm" className="bg-white">
                  <Icon name="SlidersHorizontal" size={16} className="mr-1" />
                  Фильтры
                </Button>
              </div>
              <div className="space-y-4">
                {hotels.map((hotel, index) => (
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
                          className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                        >
                          <Icon name="Heart" size={20} />
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
                          {hotel.amenities.map((amenity) => (
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
                          <Button className="gradient-bg text-white border-0">
                            Забронировать
                            <Icon name="ArrowRight" size={16} className="ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="map" className="animate-fade-in">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Map" size={64} className="mx-auto mb-4 text-primary" />
                  <h3 className="text-2xl font-bold mb-2">Интерактивная карта</h3>
                  <p className="text-gray-600 mb-4">Здесь будет интерактивная карта Сочи с метками</p>
                  <Button className="gradient-bg text-white">
                    <Icon name="Navigation" size={16} className="mr-2" />
                    Включить геолокацию
                  </Button>
                </div>
              </div>
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
                    <div className="text-2xl font-bold gradient-text">8</div>
                    <div className="text-sm text-gray-600">Избранное</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                    <div className="text-2xl font-bold gradient-text">3</div>
                    <div className="text-sm text-gray-600">Бронирования</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white">
                    <Icon name="History" size={20} className="mr-3" />
                    История посещений
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white">
                    <Icon name="Calendar" size={20} className="mr-3" />
                    Мои бронирования
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white">
                    <Icon name="Settings" size={20} className="mr-3" />
                    Настройки предпочтений
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3 bg-white">
                    <Icon name="Bell" size={20} className="mr-3" />
                    Уведомления
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
