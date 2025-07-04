<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use App\Models\Property;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateProperty extends CreateRecord
{
    protected static string $resource = PropertyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Generate slug from title if not provided
        if (empty($data['slug']) && !empty($data['title'])) {
            $data['slug'] = Property::createUniqueSlug($data['title']);
        }

        // Set default values
        $data['currency'] = $data['currency'] ?? 'USD';
        $data['billing_cycle'] = $data['billing_cycle'] ?? 'monthly';
        $data['status'] = $data['status'] ?? 'active';
        $data['is_available'] = $data['is_available'] ?? true;

        return $data;
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
