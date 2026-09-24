// Catálogo BuBus Originals — traído del proyecto "BuBus Store"
// (entrega final del módulo Front-End JS). Listo para cuando se porte
// TarjetaProducto de Clase 3 a proyecto-final.

export interface DatoProducto {
  nombre: string
  categoria: string
  precio: number
  imagen: string
}

export const productos: DatoProducto[] = [
  { nombre: 'Remera Básica Estampada DTF', categoria: 'Remeras DTF', precio: 4500, imagen: 'https://placehold.co/400x280/EDE9FE/4C1D95?text=Remera+B%C3%A1sica+DTF&font=montserrat' },
  { nombre: 'Remera Oversize Full Print', categoria: 'Remeras DTF', precio: 6500, imagen: 'https://placehold.co/400x280/F5D0FE/4C1D95?text=Remera+Oversize+DTF&font=montserrat' },
  { nombre: 'Remera Dama Estampada', categoria: 'Remeras DTF', precio: 5000, imagen: 'https://placehold.co/400x280/D946EF/ffffff?text=Remera+Dama+DTF&font=montserrat' },
  { nombre: 'Buzo Canguro Estampado', categoria: 'Buzos DTF', precio: 8500, imagen: 'https://placehold.co/400x280/7C3AED/ffffff?text=Buzo+Canguro+DTF&font=montserrat' },
  { nombre: 'Buzo con Capucha Full Print', categoria: 'Buzos DTF', precio: 12000, imagen: 'https://placehold.co/400x280/4C1D95/ffffff?text=Buzo+Full+Print+DTF&font=montserrat' },
  { nombre: 'Campera Rompevientos Estampada', categoria: 'Camperas DTF', precio: 15000, imagen: 'https://placehold.co/400x280/3B0764/D946EF?text=Campera+Rompevientos+DTF&font=montserrat' },
  { nombre: 'Campera Polar con Estampado', categoria: 'Camperas DTF', precio: 18000, imagen: 'https://placehold.co/400x280/4C1D95/22C55E?text=Campera+Polar+DTF&font=montserrat' },
  { nombre: 'Cartera de Tela Estampada', categoria: 'Carteras DTF', precio: 5500, imagen: 'https://placehold.co/400x280/EDE9FE/7C3AED?text=Cartera+DTF&font=montserrat' },
  { nombre: 'Tote Bag DTF Personalizada', categoria: 'Carteras DTF', precio: 3500, imagen: 'https://placehold.co/400x280/22C55E/ffffff?text=Tote+Bag+DTF&font=montserrat' },
  { nombre: 'Diseño DTF Tamaño A4', categoria: 'Diseños DTF', precio: 800, imagen: 'https://placehold.co/400x280/F5D0FE/4C1D95?text=Dise%C3%B1o+DTF+A4&font=montserrat' },
  { nombre: 'Diseño DTF Tamaño A3', categoria: 'Diseños DTF', precio: 1400, imagen: 'https://placehold.co/400x280/D946EF/ffffff?text=Dise%C3%B1o+DTF+A3&font=montserrat' },
  { nombre: 'Pack 5 Diseños DTF a elección', categoria: 'Diseños DTF', precio: 3500, imagen: 'https://placehold.co/400x280/7C3AED/ffffff?text=Pack+5+DTF&font=montserrat' },
]
