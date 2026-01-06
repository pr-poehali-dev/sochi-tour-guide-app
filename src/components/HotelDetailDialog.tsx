import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useFavorites } from '@/contexts/FavoritesContext';
import BookingDialog from './BookingDialog';
import { useBooking } from '@/contexts/BookingContext';

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  amenitiesDisplay: string[];
  coordinates: [number, number];
  stars: number;
  district: string;
  type: string;
  fullDescription?: string;
  highlights?: string[];
  rooms?: {
    type: string;
    description: string;
  }[];
  services?: string[];
  nearbyAttractions?: string[];
  checkInTime?: string;
  checkOutTime?: string;
  cancellationPolicy?: string;
}

interface HotelDetailDialogProps {
  hotel: Hotel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotelDetailDialog = ({ hotel, open, onOpenChange }: HotelDetailDialogProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addBooking } = useBooking();

  if (!hotel) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hotel.name}</DialogTitle>
          <div className="flex items-center gap-2 text-gray-600">
            <Icon name="MapPin" size={16} />
            <span>{hotel.location}</span>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Изображение */}
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFavorite(hotel.id)}
                className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full w-10 h-10 p-0"
              >
                <Icon 
                  name="Heart" 
                  size={18} 
                  className={isFavorite(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                />
              </Button>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-3">
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full">
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{hotel.rating}</span>
              </div>
              <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full font-semibold">
                {'⭐'.repeat(hotel.stars)}
              </div>
            </div>
          </div>

          {/* Цена и бронирование */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                {hotel.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-gray-600">за ночь</div>
            </div>
            <BookingDialog hotel={hotel} onBook={addBooking}>
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white">
                <Icon name="Calendar" size={20} className="mr-2" />
                Забронировать
              </Button>
            </BookingDialog>
          </div>

          {/* Описание */}
          {hotel.fullDescription && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Описание</h3>
              <p className="text-gray-600 leading-relaxed">{hotel.fullDescription}</p>
            </div>
          )}

          {/* Преимущества */}
          {hotel.highlights && hotel.highlights.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Почему выбирают этот отель</h3>
              <div className="grid gap-3">
                {hotel.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Удобства */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Удобства и услуги</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hotel.amenitiesDisplay.map(amenity => (
                <div key={amenity} className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-purple-500" />
                  <span className="text-gray-700 text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Типы номеров */}
          {hotel.rooms && hotel.rooms.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Типы номеров</h3>
              <div className="grid gap-3">
                {hotel.rooms.map((room, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="font-medium mb-1">{room.type}</div>
                    <div className="text-gray-600 text-sm">{room.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Поблизости */}
          {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-purple-500" />
                Рядом с отелем
              </h3>
              <div className="flex flex-wrap gap-2">
                {hotel.nearbyAttractions.map((attraction, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {attraction}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Информация о заезде */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {hotel.checkInTime && (
              <div className="flex items-start gap-2">
                <Icon name="LogIn" size={20} className="text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Заезд</div>
                  <div className="text-gray-600 text-sm">{hotel.checkInTime}</div>
                </div>
              </div>
            )}
            {hotel.checkOutTime && (
              <div className="flex items-start gap-2">
                <Icon name="LogOut" size={20} className="text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Выезд</div>
                  <div className="text-gray-600 text-sm">{hotel.checkOutTime}</div>
                </div>
              </div>
            )}
          </div>

          {/* Политика отмены */}
          {hotel.cancellationPolicy && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Info" size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm mb-1">Условия отмены</div>
                  <div className="text-gray-600 text-sm">{hotel.cancellationPolicy}</div>
                </div>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Icon name="Navigation" size={18} className="mr-2" />
              Показать на карте
            </Button>
            <Button variant="outline" className="flex-1">
              <Icon name="Share2" size={18} className="mr-2" />
              Поделиться
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelDetailDialog;
