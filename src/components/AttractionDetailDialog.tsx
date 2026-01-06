import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useFavorites } from '@/contexts/FavoritesContext';

interface Attraction {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  coordinates: [number, number];
  rating: number;
  tags: string[];
  highlights?: string[];
  bestTime?: string;
  duration?: string;
  price?: string;
  tips?: string[];
}

interface AttractionDetailDialogProps {
  attraction: Attraction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttractionDetailDialog = ({ attraction, open, onOpenChange }: AttractionDetailDialogProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!attraction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{attraction.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Изображение */}
          <div className="relative h-80 rounded-lg overflow-hidden">
            <img 
              src={attraction.image} 
              alt={attraction.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFavorite(attraction.id)}
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
              >
                <Icon 
                  name="Heart" 
                  size={18} 
                  className={isFavorite(attraction.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full">
              <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{attraction.rating}</span>
            </div>
          </div>

          {/* Теги */}
          <div className="flex flex-wrap gap-2">
            {attraction.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-700">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Полное описание */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Описание</h3>
            <p className="text-gray-600 leading-relaxed">{attraction.fullDescription}</p>
          </div>

          {/* Особенности */}
          {attraction.highlights && attraction.highlights.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Почему стоит посетить</h3>
              <div className="grid gap-3">
                {attraction.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icon name="Check" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Информация */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            {attraction.bestTime && (
              <div className="flex items-start gap-2">
                <Icon name="Clock" size={20} className="text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Лучшее время</div>
                  <div className="text-gray-600 text-sm">{attraction.bestTime}</div>
                </div>
              </div>
            )}
            {attraction.duration && (
              <div className="flex items-start gap-2">
                <Icon name="Timer" size={20} className="text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Длительность</div>
                  <div className="text-gray-600 text-sm">{attraction.duration}</div>
                </div>
              </div>
            )}
            {attraction.price && (
              <div className="flex items-start gap-2">
                <Icon name="Wallet" size={20} className="text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Стоимость</div>
                  <div className="text-gray-600 text-sm">{attraction.price}</div>
                </div>
              </div>
            )}
          </div>

          {/* Советы */}
          {attraction.tips && attraction.tips.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="Lightbulb" size={20} className="text-yellow-500" />
                Полезные советы
              </h3>
              <ul className="space-y-2">
                {attraction.tips.map((tip, index) => (
                  <li key={index} className="text-gray-600 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
              onClick={() => {
                const [lat, lng] = attraction.coordinates;
                window.open(`https://yandex.ru/maps/?pt=${lng},${lat}&z=15&l=map`, '_blank');
              }}
            >
              <Icon name="Navigation" size={18} className="mr-2" />
              Показать на карте
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                const shareData = {
                  title: attraction.name,
                  text: `${attraction.name} - ${attraction.description}`,
                  url: window.location.href
                };
                if (navigator.share) {
                  navigator.share(shareData);
                } else {
                  navigator.clipboard.writeText(`${attraction.name}\n${attraction.description}\n${window.location.href}`);
                  alert('Ссылка скопирована!');
                }
              }}
            >
              <Icon name="Share2" size={18} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttractionDetailDialog;