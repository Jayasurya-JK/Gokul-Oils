
export interface WooDownload {
    id: string;
    name: string;
    file: string;
}

export interface WooDefaultAttribute {
    id: number;
    name: string;
    option: string;
}

export interface WooProductImage {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
}


export interface WooProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    type: 'simple' | 'variable' | 'grouped' | 'external';
    status: 'publish' | 'pending' | 'private' | 'draft';
    featured: boolean;
    catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from: string | null;
    date_on_sale_from_gmt: string | null;
    date_on_sale_to: string | null;
    date_on_sale_to_gmt: string | null;
    price_html: string;
    on_sale: boolean;
    purchasable: boolean;
    total_sales: number;
    virtual: boolean;
    downloadable: boolean;
    downloads: WooDownload[];
    download_limit: number;
    download_expiry: number;
    external_url: string;
    button_text: string;
    tax_status: 'taxable' | 'shipping' | 'none';
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: number | null;
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    backorders: 'no' | 'notify' | 'yes';
    backorders_allowed: boolean;
    backordered: boolean;
    sold_individually: boolean;
    weight: string;
    dimensions: {
        length: string;
        width: string;
        height: string;
    };
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    shipping_class_id: number;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    related_ids: number[];
    upsell_ids: number[];
    cross_sell_ids: number[];
    parent_id: number;
    purchase_note: string;
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
    tags: {
        id: number;
        name: string;
        slug: string;
    }[];
    images: WooProductImage[];
    attributes: {
        id: number;
        name: string;
        position: number;
        visible: boolean;
        variation: boolean;
        options: string[];
    }[];
    default_attributes: WooDefaultAttribute[];
    variations: number[];
    grouped_products: number[];
    menu_order: number;
    meta_data: {
        id: number;
        key: string;
        value: string;
    }[];
    default_variation_id?: number;
}

export interface WooVariationAttribute {
    id: number;
    name: string;
    option: string;
}

export interface WooVariation extends Omit<WooProduct, 'attributes'> {
    attributes: WooVariationAttribute[];
    image?: WooProductImage;
}

// Order Types

export interface WooAddress {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email?: string;
    phone?: string;
}

export interface WooLineItem {
    product_id: number;
    quantity: number;
    variation_id?: number;
}


export interface WooOrderPayload {
    payment_method: string;
    payment_method_title: string;
    set_paid: boolean;
    status?: string;
    transaction_id?: string;
    customer_id?: number;
    billing: WooAddress;
    shipping: WooAddress;
    line_items: WooLineItem[];
    shipping_lines?: Array<{
        method_id: string;
        method_title: string;
        total: string;
    }>;
    fee_lines?: Array<{
        name: string;
        total: string;
        tax_class?: string;
    }>;
    meta_data?: any[];
}

export interface WooOrder {
    id: number;
    parent_id: number;
    status: string;
    currency: string;
    version: string;
    prices_include_tax: boolean;
    date_created: string;
    date_modified: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: WooAddress;
    shipping: WooAddress;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: string | null;
    date_paid: string | null;
    cart_hash: string;
    number: string;
    meta_data: any[];
    line_items: any[];
    tax_lines: any[];
    shipping_lines: any[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
}

export interface WooCustomer {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    billing: WooAddress;
    shipping: WooAddress;
    is_paying_customer: boolean;
    avatar_url: string;
    meta_data: any[];
}
