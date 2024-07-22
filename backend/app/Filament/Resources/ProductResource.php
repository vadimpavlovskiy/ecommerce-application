<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
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
