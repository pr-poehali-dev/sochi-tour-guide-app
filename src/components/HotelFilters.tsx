import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface HotelFilters {
  priceRange: [number, number];
  minRating: number;
  amenities: string[];
  stars: number[];
  districts: string[];
  types: string[];
}

interface HotelFiltersProps {
  filters: HotelFilters;
  onChange: (filters: HotelFilters) => void;
}

const availableAmenities = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'Wifi' },
  { id: 'pool', label: 'Бассейн', icon: 'Waves' },
  { id: 'spa', label: 'СПА', icon: 'Sparkles' },
  { id: 'restaurant', label: 'Ресторан', icon: 'UtensilsCrossed' },
  { id: 'parking', label: 'Парковка', icon: 'ParkingCircle' },
  { id: 'fitness', label: 'Фитнес', icon: 'Dumbbell' },
  { id: 'beach', label: 'Пляж', icon: 'Umbrella' },
  { id: 'bar', label: 'Бар', icon: 'Wine' },
];

const districts = [
  { id: 'adler', label: 'Адлерский район' },
  { id: 'center', label: 'Центральный район' },
  { id: 'olympic', label: 'Олимпийский парк' },
  { id: 'krasnaya-polyana', label: 'Красная Поляна' },
  { id: 'lazarevsky', label: 'Лазаревский район' },
  { id: 'khostinsky', label: 'Хостинский район' },
];

const types = [
  { id: 'hotel', label: 'Отель' },
  { id: 'apartment', label: 'Апартаменты' },
  { id: 'guesthouse', label: 'Гостевой дом' },
  { id: 'resort', label: 'Курорт' },
];

const HotelFiltersComponent = ({ filters, onChange }: HotelFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...localFilters, minRating: value[0] };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleAmenityToggle = (amenityId: string) => {
    const newAmenities = localFilters.amenities.includes(amenityId)
      ? localFilters.amenities.filter(a => a !== amenityId)
      : [...localFilters.amenities, amenityId];
    const newFilters = { ...localFilters, amenities: newAmenities };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleStarsToggle = (stars: number) => {
    const newStars = localFilters.stars.includes(stars)
      ? localFilters.stars.filter(s => s !== stars)
      : [...localFilters.stars, stars];
    const newFilters = { ...localFilters, stars: newStars };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleDistrictToggle = (district: string) => {
    const newDistricts = localFilters.districts.includes(district)
      ? localFilters.districts.filter(d => d !== district)
      : [...localFilters.districts, district];
    const newFilters = { ...localFilters, districts: newDistricts };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = localFilters.types.includes(type)
      ? localFilters.types.filter(t => t !== type)
      : [...localFilters.types, type];
    const newFilters = { ...localFilters, types: newTypes };
    setLocalFilters(newFilters);
    onChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: HotelFilters = {
      priceRange: [0, 50000],
      minRating: 0,
      amenities: [],
      stars: [],
      districts: [],
      types: [],
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">Цена за ночь</Label>
        <div className="space-y-3">
          <Slider
            value={[localFilters.priceRange[0], localFilters.priceRange[1]]}
            onValueChange={handlePriceChange}
            max={50000}
            min={0}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{localFilters.priceRange[0].toLocaleString('ru-RU')} ₽</span>
            <span>{localFilters.priceRange[1].toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Минимальный рейтинг</Label>
        <div className="space-y-3">
          <Slider
            value={[localFilters.minRating]}
            onValueChange={handleRatingChange}
            max={5}
            min={0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Любой</span>
            <span className="font-semibold">{localFilters.minRating.toFixed(1)} ⭐</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Звёздность</Label>
        <div className="flex gap-2">
          {[3, 4, 5].map((star) => (
            <div key={star} className="flex items-center space-x-2">
              <Checkbox
                id={`star-${star}`}
                checked={localFilters.stars.includes(star)}
                onCheckedChange={() => handleStarsToggle(star)}
              />
              <label
                htmlFor={`star-${star}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {star} ★
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Район</Label>
        <div className="space-y-2">
          {districts.map((district) => (
            <div key={district.id} className="flex items-center space-x-2">
              <Checkbox
                id={district.id}
                checked={localFilters.districts.includes(district.id)}
                onCheckedChange={() => handleDistrictToggle(district.id)}
              />
              <label
                htmlFor={district.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {district.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Тип размещения</Label>
        <div className="space-y-2">
          {types.map((type) => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={localFilters.types.includes(type.id)}
                onCheckedChange={() => handleTypeToggle(type.id)}
              />
              <label
                htmlFor={type.id}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Удобства</Label>
        <div className="grid grid-cols-2 gap-3">
          {availableAmenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={amenity.id}
                checked={localFilters.amenities.includes(amenity.id)}
                onCheckedChange={() => handleAmenityToggle(amenity.id)}
              />
              <label
                htmlFor={amenity.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Icon name={amenity.icon as any} size={16} />
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full" 
        onClick={handleReset}
      >
        <Icon name="RotateCcw" size={16} className="mr-2" />
        Сбросить фильтры
      </Button>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <Card className="border-0 shadow-lg bg-white sticky top-24">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Фильтры</h3>
            <FiltersContent />
          </CardContent>
        </Card>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-white">
              <Icon name="SlidersHorizontal" size={16} className="mr-2" />
              Фильтры
              {(localFilters.amenities.length > 0 || localFilters.minRating > 0 || 
                localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 50000 ||
                localFilters.stars.length > 0 || localFilters.districts.length > 0 ||
                localFilters.types.length > 0) && (
                <span className="ml-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {localFilters.amenities.length + localFilters.stars.length + 
                   localFilters.districts.length + localFilters.types.length +
                   (localFilters.minRating > 0 ? 1 : 0) + 
                   ((localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 50000) ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фильтры отелей</SheetTitle>
              <SheetDescription>
                Настройте параметры поиска отелей
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default HotelFiltersComponent;