import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

type TransportMode = 'walk' | 'car' | 'taxi' | 'bus' | 'bike' | 'scooter';

interface RouteOption {
  mode: TransportMode;
  emoji: string;
  label: string;
  time: string;
  distance: string;
  cost: string;
  description?: string;
  accessible?: boolean;
}

interface RouteExample {
  from: string;
  to: string;
  fromCoords: [number, number];
  toCoords: [number, number];
}

const transportModes = [
  { mode: 'walk' as TransportMode, emoji: '👣', label: 'Пешком' },
  { mode: 'car' as TransportMode, emoji: '🚗', label: 'Машина' },
  { mode: 'taxi' as TransportMode, emoji: '🚖', label: 'Такси' },
  { mode: 'bus' as TransportMode, emoji: '🚌', label: 'Автобус' },
  { mode: 'bike' as TransportMode, emoji: '🚲', label: 'Велосипед' },
  { mode: 'scooter' as TransportMode, emoji: '🛴', label: 'Самокат' },
];

const routeExamples: RouteExample[] = [
  {
    from: 'Отель "Азимут"',
    to: 'Пляж "Ривьера"',
    fromCoords: [43.5891, 39.7202],
    toCoords: [43.5994, 39.7255],
  },
  {
    from: 'Отель "Камелия"',
    to: 'Пивной ресторан "Мюнхен"',
    fromCoords: [43.5831, 39.7186],
    toCoords: [43.5885, 39.7241],
  },
];

const routeData: Record<string, Record<TransportMode, RouteOption>> = {
  'route1': {
    walk: { mode: 'walk', emoji: '👣', label: 'Пешком', time: '25 мин', distance: '2,1 км', cost: 'Бесплатно', accessible: true, description: 'По набережной, есть пандусы' },
    car: { mode: 'car', emoji: '🚗', label: 'На машине', time: '8 мин', distance: '2,3 км', cost: 'Бензин ~50 ₽', accessible: false },
    taxi: { mode: 'taxi', emoji: '🚖', label: 'На такси', time: '10 мин', distance: '2,3 км', cost: 'от 200 ₽', accessible: true, description: 'Можно заказать с пандусом' },
    bus: { mode: 'bus', emoji: '🚌', label: 'На автобусе', time: '20 мин', distance: '—', cost: '50 ₽', description: '№ 57, 125', accessible: true },
    bike: { mode: 'bike', emoji: '🚲', label: 'На велосипеде', time: '12 мин', distance: '2,1 км', cost: 'от 100 ₽/час', accessible: false },
    scooter: { mode: 'scooter', emoji: '🛴', label: 'На самокате', time: '15 мин', distance: '2,1 км', cost: 'от 80 ₽', accessible: false },
  },
  'route2': {
    walk: { mode: 'walk', emoji: '👣', label: 'Пешком', time: '12 мин', distance: '950 м', cost: 'Бесплатно', accessible: true, description: 'Ровная дорога' },
    car: { mode: 'car', emoji: '🚗', label: 'На машине', time: '5 мин', distance: '1,1 км', cost: 'Бензин ~30 ₽', accessible: false },
    taxi: { mode: 'taxi', emoji: '🚖', label: 'На такси', time: '6 мин', distance: '1,1 км', cost: 'от 150 ₽', accessible: true, description: 'Доступно для инвалидных колясок' },
    bus: { mode: 'bus', emoji: '🚌', label: 'На автобусе', time: '15 мин', distance: '—', cost: '50 ₽', description: '№ 105, 121', accessible: true },
    bike: { mode: 'bike', emoji: '🚲', label: 'На велосипеде', time: '7 мин', distance: '950 м', cost: 'от 100 ₽/час', accessible: false },
    scooter: { mode: 'scooter', emoji: '🛴', label: 'На самокате', time: '9 мин', distance: '950 м', cost: 'от 60 ₽', accessible: false },
  },
};

export default function RouteMap() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedMode, setSelectedMode] = useState<TransportMode>('walk');
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [showAccessible, setShowAccessible] = useState(false);

  const handleExampleRoute = (example: RouteExample, routeKey: string) => {
    setFrom(example.from);
    setTo(example.to);
    setCurrentRoute(routeKey);
  };

  const getYandexMapUrl = () => {
    if (!currentRoute) {
      return "https://yandex.ru/map-widget/v1/?ll=39.7277%2C43.5855&z=13&l=map";
    }
    
    const example = routeExamples[parseInt(currentRoute.replace('route', '')) - 1];
    if (!example) {
      return "https://yandex.ru/map-widget/v1/?ll=39.7277%2C43.5855&z=13&l=map";
    }

    const fromLat = example.fromCoords[0];
    const fromLon = example.fromCoords[1];
    const toLat = example.toCoords[0];
    const toLon = example.toCoords[1];

    const centerLat = (fromLat + toLat) / 2;
    const centerLon = (fromLon + toLon) / 2;

    const rttMode = selectedMode === 'walk' ? 'pd' : 
                    selectedMode === 'car' ? 'auto' : 
                    selectedMode === 'bike' ? 'bc' : 
                    selectedMode === 'bus' ? 'mt' : 'auto';

    return `https://yandex.ru/map-widget/v1/?ll=${centerLon},${centerLat}&z=14&l=map&rtext=${fromLat},${fromLon}~${toLat},${toLon}&rtt=${rttMode}`;
  };

  const getCurrentRouteOptions = (): RouteOption[] => {
    if (!currentRoute || !routeData[currentRoute]) return [];
    return Object.values(routeData[currentRoute]);
  };

  const filteredOptions = getCurrentRouteOptions().filter(option => 
    !showAccessible || option.accessible
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Маршруты по Сочи</h1>
          <p className="text-gray-600">Постройте оптимальный маршрут и выберите удобный способ передвижения</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Левая панель - Форма и результаты */}
          <div className="space-y-6">
            {/* Форма поиска маршрута */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="space-y-4">
                <div className="relative">
                  <Icon name="MapPin" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <Input
                    placeholder="Откуда"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-11 h-12 text-lg"
                  />
                </div>
                <div className="relative">
                  <Icon name="MapPin" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                  <Input
                    placeholder="Куда"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-11 h-12 text-lg"
                  />
                </div>
                <Button className="w-full h-12 text-lg">
                  <Icon name="Navigation" size={20} className="mr-2" />
                  Построить маршрут
                </Button>
              </div>
            </Card>

            {/* Готовые примеры маршрутов */}
            <Card className="p-6 bg-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Sparkles" size={20} className="text-purple-500" />
                Популярные маршруты
              </h3>
              <div className="space-y-3">
                {routeExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleRoute(example, `route${index + 1}`)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="MapPin" size={16} className="text-green-500" />
                          <span className="font-medium text-sm">{example.from}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="MapPin" size={16} className="text-red-500" />
                          <span className="font-medium text-sm">{example.to}</span>
                        </div>
                      </div>
                      <Icon name="ArrowRight" size={20} className="text-gray-400 mt-2" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Способы передвижения */}
            <Card className="p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Способ передвижения</h3>
                <button
                  onClick={() => setShowAccessible(!showAccessible)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    showAccessible 
                      ? 'bg-blue-100 border-blue-400 text-blue-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon name="Accessibility" size={18} />
                  <span className="text-sm font-medium">Доступность</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {transportModes.map((transport) => (
                  <button
                    key={transport.mode}
                    onClick={() => setSelectedMode(transport.mode)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMode === transport.mode
                        ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{transport.emoji}</div>
                    <div className="text-sm font-medium text-gray-700">{transport.label}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Результаты маршрутов */}
            {currentRoute && filteredOptions.length > 0 && (
              <Card className="p-6 bg-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Route" size={20} className="text-purple-500" />
                  Варианты маршрутов
                </h3>
                <div className="space-y-3">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.mode}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMode === option.mode
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 cursor-pointer'
                      }`}
                      onClick={() => setSelectedMode(option.mode)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{option.emoji}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">{option.label}</div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              {option.time}
                            </span>
                            {option.distance !== '—' && (
                              <span className="flex items-center gap-1">
                                <Icon name="Navigation" size={14} />
                                {option.distance}
                              </span>
                            )}
                            <span className="flex items-center gap-1 font-medium text-purple-600">
                              <Icon name="Wallet" size={14} />
                              {option.cost}
                            </span>
                          </div>
                          {option.description && (
                            <div className="text-sm text-gray-500">{option.description}</div>
                          )}
                          {option.accessible && showAccessible && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-blue-600 font-medium">
                              <Icon name="Accessibility" size={14} />
                              Доступно для маломобильных
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Правая панель - Карта */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="overflow-hidden shadow-lg">
              <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-green-100">
                <iframe
                  src={getYandexMapUrl()}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="absolute inset-0"
                  title="Карта Сочи"
                  key={currentRoute || 'default'}
                />
                {currentRoute && (
                  <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="Route" size={20} className="text-purple-500" />
                          <span className="font-semibold text-gray-900">Маршрут на карте</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-gray-700 font-medium">{from}</span>
                          </div>
                          <Icon name="ArrowRight" size={16} className="text-gray-400" />
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-gray-700 font-medium">{to}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!currentRoute && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Map" size={20} className="text-purple-500" />
                      <span className="font-semibold text-gray-900">Карта Сочи</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Легенда маршрута */}
            {currentRoute && (
              <>
                <Card className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <div className="font-semibold text-gray-900 mb-2">Обозначения на карте</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-gray-700">Точка отправления (А)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-gray-700">Точка назначения (Б)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-0.5 bg-blue-500"></div>
                          <span className="text-gray-700">Линия маршрута</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    const example = routeExamples[parseInt(currentRoute.replace('route', '')) - 1];
                    if (example) {
                      const fromLat = example.fromCoords[0];
                      const fromLon = example.fromCoords[1];
                      const toLat = example.toCoords[0];
                      const toLon = example.toCoords[1];
                      window.open(`https://yandex.ru/maps/?rtext=${fromLat},${fromLon}~${toLat},${toLon}&rtt=auto`, '_blank');
                    }
                  }}
                >
                  <Icon name="ExternalLink" size={18} className="mr-2" />
                  Открыть в Яндекс.Картах
                </Button>
              </>
            )}

            {/* Информация о доступности */}
            {showAccessible && (
              <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <div className="font-semibold mb-1">Доступность для маломобильных</div>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Пешеходные маршруты с пандусами</li>
                      <li>• Автобусы с низким полом</li>
                      <li>• Такси с возможностью перевозки колясок</li>
                      <li>• Лифты в общественных местах</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}