interface VariationsProps {
  size: string;
  inStock: number;
}

interface ImageProps {
  url: string;
  id: string;
}

interface ReviewProps {
  id: string;
  userId: string;
  productId: string;
  userName: string;
  text: string;
  rating: number;
  createdAt: Date;
}

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variations: VariationsProps[];
  images: ImageProps[];
  reviews?: ReviewProps[];
}

export interface CartProductProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  inStock: number;
  imageUrl: string;
}

export interface CurrentUserProps {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  role: string;
}

interface AddressProps {
  city: string;
  country: string;
  line1: string;
  line2: string;
  cep: string;
  state: string;
}

export interface OrderProps {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  deliveryStatus: string | null;
  createdAt: Date;
  paymentIntentId: string;
  products: CartProductProps[];
  address: AddressProps | null;
  user?: CurrentUserProps;
}
