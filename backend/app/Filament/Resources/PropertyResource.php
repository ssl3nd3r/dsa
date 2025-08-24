<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PropertyResource\Pages;
use App\Filament\Resources\PropertyResource\RelationManagers;
use App\Models\Property;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;

class PropertyResource extends Resource
{
    protected static ?string $model = Property::class;

    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $navigationGroup = 'Property Management';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(255),
                                TextInput::make('slug')
                                    ->maxLength(255)
                                    ->helperText('Auto-generated from title if left empty'),
                            ]),
                        RichEditor::make('description')
                            ->columnSpanFull(),
                        Grid::make(1)
                            ->schema([
                                TextInput::make('location')
                                    ->required()
                                    ->maxLength(255),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('address.street')
                                    ->label('Street Address')
                                    ->maxLength(255),
                                TextInput::make('address.city')
                                    ->label('City')
                                    ->maxLength(255),
                            ]),
                    ]),

                Section::make('Property Details')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('property_type')
                                    ->options([
                                        '1BR' => '1BR',
                                        '2BR' => '2BR',
                                        '3BR' => '3BR',
                                        '4BR+' => '4BR+',
                                        'Studio' => 'Studio',
                                    ])
                                    ->required(),
                                Select::make('room_type')
                                    ->options([
                                        'Entire Place' => 'Entire Place',
                                        'Private Room' => 'Private Room',
                                        'Master Room' => 'Master Room',
                                        'Partitioned Room' => 'Partitioned Room',
                                        'Bed Space' => 'Bed Space',
                                    ])
                                    ->required(),
                                TextInput::make('size')
                                    ->numeric()
                                    ->suffix('sq ft'),
                            ]),
                        Grid::make(3)
                            ->schema([
                                TextInput::make('bedrooms')
                                    ->numeric()
                                    ->minValue(0),
                                TextInput::make('bathrooms')
                                    ->numeric()
                                    ->minValue(0)
                                    ->step(0.5),
                                TextInput::make('price')
                                    ->numeric()
                                    ->required()
                                    ->prefix('AED'),
                            ]),
                        Grid::make(2)
                            ->schema([
                                Select::make('currency')
                                    ->options([
                                        'AED' => 'AED',
                                        'USD' => 'USD',
                                        'EUR' => 'EUR',
                                    ])
                                    ->default('USD'),
                                Select::make('billing_cycle')
                                    ->options([
                                        'Monthly' => 'Monthly',
                                        'Quarterly' => 'Quarterly',
                                        'Yearly' => 'Yearly',
                                    ])
                                    ->default('monthly'),
                            ]),
                    ]),

                Section::make('Availability & Stay')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                DatePicker::make('available_from')
                                    ->label('Available From'),
                                Toggle::make('is_available')
                                    ->label('Currently Available')
                                    ->default(true),
                            ]),
                        Grid::make(2)
                            ->schema([
                                TextInput::make('minimum_stay')
                                    ->numeric()
                                    ->suffix('months'),
                                TextInput::make('maximum_stay')
                                    ->numeric()
                                    ->suffix('months'),
                            ]),
                    ]),

                Section::make('Utilities & Amenities')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Toggle::make('utilities_included')
                                    ->label('Utilities Included in Rent'),
                                TextInput::make('utilities_cost')
                                    ->numeric()
                                    ->prefix('AED')
                                    ->suffix('per month'),
                            ]),
                        KeyValue::make('amenities')
                            ->label('Amenities')
                            ->keyLabel('Amenity')
                            ->valueLabel('Available')
                            ->columnSpanFull(),
                    ]),

                Section::make('Owner ')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('owner_id')
                                    ->label('Property Owner')
                                    ->options(User::all()->pluck('name', 'id'))
                                    ->searchable()
                                    ->required(),
                            ]),
                        TextInput::make('matching_score')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->helperText('Matching score for roommate preferences (0-100)'),
                    ]),

                Section::make('Media')
                    ->schema([
                        FileUpload::make('images')
                            ->multiple()
                            ->image()
                            ->maxFiles(10)
                            ->columnSpanFull(),
                    ]),

                Section::make('Roommate Preferences')
                    ->schema([
                        KeyValue::make('roommate_preferences')
                            ->label('Preferences')
                            ->keyLabel('Preference Type')
                            ->valueLabel('Details')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                TextColumn::make('location')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('property_type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        '1BR' => 'info',
                        '2BR' => 'success',
                        '3BR' => 'warning',
                        '4BR+' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('room_type')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'private' => 'info',
                        'shared' => 'success',
                        'entire' => 'warning',
                        default => 'gray',
                    }),
                TextColumn::make('price')
                    ->money('AED')
                    ->sortable(),
                ToggleColumn::make('is_available')
                    ->label('Available'),
                TextColumn::make('owner.name')
                    ->label('Owner')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('property_type')
                    ->options([
                        '1BR' => '1BR',
                        '2BR' => '2BR',
                        '3BR' => '3BR',
                        '4BR+' => '4BR+',
                        'Studio' => 'Studio',
                    ]),
                SelectFilter::make('room_type')
                    ->options([
                        'Entire Place' => 'Entire Place',
                        'Private Room' => 'Private Room',
                        'Master Room' => 'Master Room',
                        'Partitioned Room' => 'Partitioned Room',
                        'Bed Space' => 'Bed Space',
                    ]),
                TernaryFilter::make('is_available')
                    ->label('Available Properties'),
                SelectFilter::make('owner_id')
                    ->label('Owner')
                    ->options(User::all()->pluck('name', 'id'))
                    ->searchable(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                //
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProperties::route('/'),
            // 'view' => Pages\ViewProperty::route('/{record}'),
        ];
    }
}
