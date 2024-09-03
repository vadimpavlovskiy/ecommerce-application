<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Attribute;
use App\Models\AttributeOption;
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
use Illuminate\Support\Facades\Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->live(onBlur: true)
                ->afterStateUpdated(function (Set $set, $state) {
                    $set('slug', Str::slug($state));
                }),
            TextInput::make('slug')->required()->maxLength(255),
                RichEditor::make('description')->required()->maxLength(1200)->columnSpan('full'),
                FileUpload::make('image')
                ->required()
                ->disk('spaces')
                ->directory('products')
                ->preserveFilenames()
                ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file) {
                    return $file->getClientOriginalName();
                })
                ->saveUploadedFileUsing(function (FileUpload $component, TemporaryUploadedFile $file) {
                    $storeMethod = $component->getVisibility() === 'public' ? 'storePubliclyAs' : 'storeAs';
                    $filename = $file->getClientOriginalName();
                    return $file->{$storeMethod}($component->getDirectory(), $filename, $component->getDiskName());
                })
                ->deleteUploadedFileUsing(function ($file) {
                    Storage::disk('spaces')->delete('products/'. $file);
                })
                ->imagePreviewHeight('250')
                ->imageCropAspectRatio('1:1')
                ->imageResizeTargetWidth('500')
                ->imageResizeTargetHeight('500')
                ->image()
                ->nullable(false),
                RichEditor::make('thumbnail')->required()->maxLength(255)->columnSpan('full'),
                Section::make('Properties')
                ->description('Properties of product')
                ->schema([
                    'Length'=>TextInput::make('length')->required()->numeric(),
                    'Width' => TextInput::make('width')->required()->numeric(),
                    'Height' => TextInput::make('height')->required()->numeric(),
                ]),
                Section::make('Custom Properties')
                ->schema([
                    Repeater::make('custom_properties')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('key')->required()->label('Property Name'),
                            TextInput::make('value')->required()->label('Property Value'),
                        ])
                    ])
                    ->columns(1)
                    ->label('Custom Properties')
                    ->minItems(1)
                    ,
                ]),
                Section::make('SKUs and Attributes')
                    ->schema([
                        Repeater::make('skus')
                            ->relationship('skus')
                            ->schema([
                                TextInput::make('code')->label('SKU Code')->required(),
                                TextInput::make('price')->label('Price')->required()->numeric(),
                                TextInput::make('discounted_price')->label('Discounted Price')->numeric(),
                                // Attributes and options for each SKU
                                Repeater::make('images')
            ->relationship('images')
            ->schema([
                FileUpload::make('name')
                ->required()
                ->disk('spaces')
                ->directory('products')
                ->preserveFilenames()
                ->getUploadedFileNameForStorageUsing(function (TemporaryUploadedFile $file) {
                    return $file->getClientOriginalName();
                })
                    ->saveUploadedFileUsing(function (FileUpload $component, TemporaryUploadedFile $file) {
                        $storeMethod = $component->getVisibility() === 'public' ? 'storePubliclyAs' : 'storeAs';
                        $filename = $file->getClientOriginalName();
                        return $file->{$storeMethod}($component->getDirectory(), $filename, $component->getDiskName());
                    })
                    ->deleteUploadedFileUsing(function ($file) {
                        Storage::disk('spaces')->delete('products/'. $file);
                    })
                    ->imagePreviewHeight('250')
                    ->imageCropAspectRatio('1:1')
                    ->imageResizeTargetWidth('500')
                    ->imageResizeTargetHeight('500')
                    ->image()
                    ->nullable(false),
            ]),
                                Repeater::make('attribute_options')
                                    ->relationship('attributeOptions')
                                    ->schema([
                                        Grid::make(2)
                                            ->schema([
                                                Select::make('attribute_id')
                                                    ->label('Attribute')
                                                    ->options(Attribute::all()->pluck('name', 'id'))
                                                    ->reactive()
                                                    ->required()
                                                    ->searchable()
                                                    ->afterStateUpdated(fn ($state, Set $set) => $set('attribute_option_id', null))
                                                    ->createOptionForm([
                                                        Forms\Components\TextInput::make('name')
                                                            ->label('Attribute Name')
                                                            ->required(),
                                                    ])
                                                    ->createOptionUsing(function (array $data) {
                                                        $attribute = Attribute::create(['name' => $data['name']]);
                                                        return $attribute->id;
                                                    }),
                                                Select::make('attribute_option_id')
                                                    ->label('Option')
                                                    ->options(fn ($get) => AttributeOption::where('attribute_id', $get('attribute_id'))->pluck('value', 'id'))
                                                    ->searchable()
                                                    ->required()
                                                    ->createOptionForm([
                                                        Forms\Components\TextInput::make('value')
                                                            ->label('Attribute Option')
                                                            ->required(),
                                                    ])
                                                    ->createOptionUsing(function (array $data, $get) {
                                                        $attributeOption = AttributeOption::create([
                                                            'attribute_id' => $get('attribute_id'),
                                                            'value' => $data['value'],
                                                        ]);
                                                        return $attributeOption->id;
                                                    })
                                            ]),
                                    ])
                                    ->label('Attributes')
                                    ->columns(1)
                                    ->minItems(1),
                            ])
                            ->columns(1)
                            ->minItems(1)
                            ->label('SKUs'),
                    ])
                    ->columns(1),
            ]);

    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('price')->money('USD')->sortable(),
                TextColumn::make('discounted_price')->money('USD')->sortable(),
                TextColumn::make('created_at')->dateTime(),
                TextColumn::make('skus.code')->label('SKU Code')->limit(20),
                TextColumn::make('skus.attributeOptions.value')
                    ->label('Attributes')
                    ->limit(50),
                TextColumn::make('created_at')->label('Created At')->dateTime(),

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
        foreach ($data['skus'] as &$sku) {
            foreach ($sku['attribute_options'] as &$option) {
                // Handle new attribute creation
                if (isset($option['new_attribute']) && !empty($option['new_attribute'])) {
                    $attribute = Attribute::create(['name' => $option['new_attribute']]);
                    $option['attribute_id'] = $attribute->id;
                    unset($option['new_attribute']);
                }

                // Handle new attribute option creation
                if (isset($option['new_option']) && !empty($option['new_option'])) {
                    $attributeOption = AttributeOption::create([
                        'attribute_id' => $option['attribute_id'],
                        'value' => $option['new_option'],
                    ]);
                    $option['attribute_option_id'] = $attributeOption->id;
                    unset($option['new_option']);
                }
            }
        }

        return $data;
    }

}
