import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Location {
  name: string;
  coords: [number, number];
}

interface TransportOption {
  id: string;
  icon: string;
  name: string;
  emoji: string;
}

interface RouteResult {
  transport: string;
  duration: string;
  distance: string;
  cost: string;
  details?: string;
  accessible?: boolean;
}

const transportOptions: TransportOption[] = [
  { id: 'walking', icon: 'PersonStanding', name: 'Пешком', emoji: '👣' },
  { id: 'car', icon: 'Car', name: 'Машина', emoji: '🚗' },
  { id: 'taxi', icon: 'TramFront', name: 'Такси', emoji: '🚖' },
  { id: 'bus', icon: 'Bus', name: 'Автобус', emoji: '🚌' },
  { id: 'bike', icon: 'Bike', name: 'Велосипед', emoji: '🚲' },
  { id: 'scooter', icon: 'Waypoints', name: 'Самокат', emoji: '🛴' },
];

const locations: Record<string, Location> = {
  azimut: { name: 'Отель "Азимут"', coords: [43.589, 39.718] },
  riviera: { name: 'Пляж "Ривьера"', coords: [43.588, 39.722] },
  camellia: { name: 'Отель "Камелия"', coords: [43.581, 39.723] },
  munchen: { name: 'Пивной ресторан "Мюнхен"', coords: [43.585, 39.721] },
};

export default function RoutesPage() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedTransport, setSelectedTransport] = useState('');
  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const calculateRoute = (fromKey: string, toKey: string, transport: string) => {
    const routeData: Record<string, Record<string, RouteResult>> = {
      'azimut-riviera': {
        walking: { transport: 'Пешком 👣', duration: '25 мин', distance: '2.1 км', cost: 'Бесплатно', accessible: true },
        car: { transport: 'На машине 🚗', duration: '8 мин', distance: '2.3 км', cost: 'Бензин ~50 ₽', accessible: true },
        taxi: { transport: 'На такси 🚖', duration: '10 мин', distance: '2.3 км', cost: 'от 200 ₽', accessible: true },
        bus: { transport: 'На автобусе 🚌', duration: '20 мин', distance: '2.2 км', cost: '57, 125 — 50 ₽', details: 'Маршруты: 57, 125', accessible: true },
        bike: { transport: 'На велосипеде 🚲', duration: '10 мин', distance: '2.1 км', cost: 'Аренда ~150 ₽/час', accessible: false },
        scooter: { transport: 'На самокате 🛴', duration: '12 мин', distance: '2.1 км', cost: 'Аренда ~100 ₽', accessible: false },
      },
      'camellia-munchen': {
        walking: { transport: 'Пешком 👣', duration: '7 мин', distance: '550 м', cost: 'Бесплатно', accessible: true },
        car: { transport: 'На машине 🚗', duration: '3 мин', distance: '800 м', cost: 'Бензин ~20 ₽', accessible: true },
        taxi: { transport: 'На такси 🚖', duration: '5 мин', distance: '800 м', cost: 'от 150 ₽', accessible: true },
        bus: { transport: 'На автобусе 🚌', duration: '12 мин', distance: '900 м', cost: '3, 23 — 50 ₽', details: 'Маршруты: 3, 23', accessible: true },
        bike: { transport: 'На велосипеде 🚲', duration: '4 мин', distance: '550 м', cost: 'Аренда ~150 ₽/час', accessible: false },
        scooter: { transport: 'На самокате 🛴', duration: '5 мин', distance: '550 м', cost: 'Аренда ~100 ₽', accessible: false },
      },
    };

    const key = `${fromKey}-${toKey}`;
    const reverseKey = `${toKey}-${fromKey}`;
    
    if (transport && routeData[key]?.[transport]) {
      setRoutes([routeData[key][transport]]);
    } else if (transport && routeData[reverseKey]?.[transport]) {
      setRoutes([routeData[reverseKey][transport]]);
    } else if (routeData[key]) {
      setRoutes(Object.values(routeData[key]));
    } else if (routeData[reverseKey]) {
      setRoutes(Object.values(routeData[reverseKey]));
    } else {
      setRoutes([]);
    }
  };

  const handleBuildRoute = () => {
    if (from && to) {
      calculateRoute(from, to, selectedTransport);
    }
  };

  const handleQuickRoute = (fromKey: string, toKey: string) => {
    setFrom(fromKey);
    setTo(toKey);
    setSelectedTransport('');
    calculateRoute(fromKey, toKey, '');
  };

  const getYandexMapsUrl = () => {
    if (!from || !to) return '';
    const fromCoords = locations[from]?.coords;
    const toCoords = locations[to]?.coords;
    if (!fromCoords || !toCoords) return '';
    return `https://yandex.ru/maps/?rtext=${fromCoords[0]},${fromCoords[1]}~${toCoords[0]},${toCoords[1]}&rtt=auto`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={18} />
            Вернуться на главную
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Построить маршрут
          </h1>
          <p className="text-gray-600">Проложите оптимальный маршрут по Сочи</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Левая панель - Форма построения маршрута */}
          <div className="space-y-6">
            {/* Поля откуда/куда */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Icon name="MapPinned" size={18} className="text-blue-600" />
                  Откуда
                </label>
                <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Выберите точку отправления</option>
                  {Object.entries(locations).map(([key, loc]) => (
                    <option key={key} value={key}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Icon name="MapPin" size={18} className="text-purple-600" />
                  Куда
                </label>
                <select
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Выберите точку назначения</option>
                  {Object.entries(locations).map(([key, loc]) => (
                    <option key={key} value={key}>{loc.name}</option>
                  ))}
                </select>
              </div>

              {/* Способы передвижения */}
              <div>
                <label className="text-sm font-medium mb-3 block">Способ передвижения</label>
                <div className="grid grid-cols-3 gap-3">
                  {transportOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedTransport(selectedTransport === option.id ? '' : option.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedTransport === option.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Доступность */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAccessibility}
                    onChange={(e) => setShowAccessibility(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Icon name="Accessibility" size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">Маршруты для маломобильных граждан</span>
                </label>
                {showAccessibility && (
                  <p className="text-xs text-gray-600 mt-2 ml-7">
                    Будут показаны маршруты с пандусами, лифтами и без препятствий
                  </p>
                )}
              </div>

              <Button 
                onClick={handleBuildRoute}
                disabled={!from || !to}
                className="w-full py-6 text-lg"
              >
                <Icon name="Route" size={20} className="mr-2" />
                Построить маршрут
              </Button>

              {from && to && (
                <Button 
                  variant="outline"
                  onClick={() => window.open(getYandexMapsUrl(), '_blank')}
                  className="w-full"
                >
                  <Icon name="ExternalLink" size={18} className="mr-2" />
                  Открыть в Яндекс.Картах
                </Button>
              )}
            </div>

            {/* Готовые маршруты */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Sparkles" size={20} className="text-yellow-500" />
                Популярные маршруты
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickRoute('azimut', 'riviera')}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon name="MapPinned" size={16} className="text-blue-600" />
                    <span className="font-medium">Отель "Азимут"</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Icon name="MapPin" size={16} className="text-purple-600" />
                    <span>Пляж "Ривьера"</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">~25 мин пешком</div>
                </button>

                <button
                  onClick={() => handleQuickRoute('camellia', 'munchen')}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon name="MapPinned" size={16} className="text-blue-600" />
                    <span className="font-medium">Отель "Камелия"</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Icon name="MapPin" size={16} className="text-purple-600" />
                    <span>Ресторан "Мюнхен"</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">~7 мин пешком</div>
                </button>
              </div>
            </div>
          </div>

          {/* Правая панель - Результаты и карта */}
          <div className="space-y-6">
            {/* Карта */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <iframe
                  src={from && to ? getYandexMapsUrl() : 'https://yandex.ru/map-widget/v1/?ll=39.730208%2C43.585472&z=12'}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  className="w-full"
                  title="Карта Сочи"
                />
                {!from && !to && (
                  <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                    <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                      <p className="text-gray-600 font-medium">Выберите маршрут</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Результаты маршрутов */}
            {routes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Route" size={20} className="text-blue-600" />
                  Варианты маршрутов
                </h3>
                <div className="space-y-3">
                  {routes
                    .filter(route => !showAccessibility || route.accessible)
                    .map((route, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-gray-800">{route.transport}</div>
                        {route.accessible && showAccessibility && (
                          <Icon name="Accessibility" size={18} className="text-green-600" />
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 text-xs">Время</div>
                          <div className="font-medium">{route.duration}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Расстояние</div>
                          <div className="font-medium">{route.distance}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Стоимость</div>
                          <div className="font-medium text-blue-600">{route.cost}</div>
                        </div>
                      </div>
                      {route.details && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">{route.details}</p>
                        </div>
                      )}
                      {!route.accessible && showAccessibility && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                          <Icon name="AlertCircle" size={14} />
                          <span>Не подходит для маломобильных</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {showAccessibility && routes.every(r => !r.accessible) && (
                    <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertCircle" size={20} className="text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-orange-900 mb-1">Доступных маршрутов не найдено</p>
                          <p className="text-sm text-orange-700">
                            К сожалению, для этого направления нет полностью доступных маршрутов. Рекомендуем воспользоваться такси.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {routes.length === 0 && from && to && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center py-8">
                  <Icon name="MapPinOff" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Маршрут не найден</p>
                  <p className="text-sm text-gray-400 mt-1">Попробуйте выбрать другие точки</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}