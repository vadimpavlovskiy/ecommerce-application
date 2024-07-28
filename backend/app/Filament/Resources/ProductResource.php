<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')->required()->maxLength(255),
                RichEditor::make('description')->required()->maxLength(1200)->columnSpan('full'),
                TextInput::make('sku')->required()->minLength(5)->maxLength(300)->required()->string(),
                FileUpload::make('image')->required(),
                RichEditor::make('thumbnail')->required()->maxLength(255)->columnSpan('full'),
                Section::make('Properties')
                ->description('Properties of product')
                ->schema([
                    'Length'=>TextInput::make('length')->required()->numeric(),
                    'Width' => TextInput::make('width')->required()->numeric(),
                    'Height' => TextInput::make('height')->required()->numeric(),
                    'Sleeping Area Length' => TextInput::make('sleeping_area_length')->required()->numeric(),
                    'Sleeping Area Width' => TextInput::make('sleeping_area_width')->required()->numeric(),
                ]),
                Section::make('Price')
                ->description('Prices of product')
                ->schema([
                    'Regular price' => TextInput::make('price')->numeric()->required()->prefix('$')->maxValue(9999999.99),
                    'Discount' => Checkbox::make('is_discount')
                        ->reactive()
                        ->formatStateUsing(function (Get $get, Set $set, $state) {
                            if($get('discounted_price') !== null && $get('discounted_price') > 0.0 && $get('discounted_price') !== 0) {
                                return true;
                            } else {
                                 {
                                    return false;
                                };
                            }
                        })
                        ->afterStateUpdated(function (Get $get, Set $set, $state) {
                            if($state) {
                                $set('discounted_price', $get('discounted_price'));
                            } else {
                                $set('discounted_price', 0);
                                $set('is_discount', false);
                            }
                        }),
                    'Discrounted Price' => TextInput::make('discounted_price')->numeric()->prefix('$')->maxValue(9999999.99)->visible(fn (Get $get): bool => $get('is_discount') || $get('discounted_price') !== null || $get('discounted_price') > 0.0 || $get('discounted_price' !== 0))->nullable()->live()
                ]),
                Repeater::make('custom_properties')
                ->schema([
                    Select::make('type')->options([
                        'characteristic' => 'Characteristic',
                        'color' => 'Color',
                        'textile' => 'Textile',
                        'additional_features' => 'Additional features'
                    ])
                    ->live()
                    ->afterStateUpdated(fn (Set $set, Get $get) => $set('dynamicTypeFields', $get('type'))),
                    Grid::make(2)
                        ->schema(fn (Get $get): array => match ($get('dynamicTypeFields')) {
                            'color' => [
                                TextInput::make('name')->required()->label('Color Name'),
                                FileUpload::make('image')->required()->label('Color Image'),
                                TextInput::make('price')->required()->label('Color Price')->numeric(),
                            ],
                            'characteristic' => [
                                TextInput::make('key')->required()->label('Property Name'),
                                TextInput::make('value')->required()->label('Property Value'),
                            ],
                            'textile' => [
                                TextInput::make('name')->required()->label('Textile Name'),
                                TextInput::make('price')->required()->label('Add to price')->numeric(),
                            ],
                            'additional_features' => [
                                TextInput::make('name') -> label('Feature Name') -> required(),
                                TextInput::make('price') -> label('Feature Price')  -> numeric() -> required()
                            ],
                            default => [],
                        })
                        ->key('dynamicTypeFields'),
                ])
                ->label('Custom Properties')
                ->defaultItems(1)
                ->columns(2)
                ->minItems(0)
                ->columnSpanFull()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('sku'),
                TextColumn::make('price')->money('USD')->sortable(),
                TextColumn::make('discounted_price')->money('USD')->sortable(),
                TextColumn::make('created_at')->dateTime()
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['is_discount']);
        return $data;
    }

}
