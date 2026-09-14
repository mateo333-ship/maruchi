/*!
 * Mar.Uchi Coffee & Tea — brand data
 * IIFE — expone únicamente window.__BRAND__. No usar import/export.
 * Cuando se conecte la futura base de datos, este objeto puede sustituirse
 * por una llamada fetch() a la API sin tocar el resto del código.
 */
(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Mar.Uchi",
    fullName: "Mar.Uchi Coffee & Tea",
    tagline: "Café de especialidad y té de origen",
    city: "Castelldefels",

    contact: {
      address: "Carrer d'Arcadi Balaguer, 36-38, Local 1, 08860 Castelldefels (Barcelona)",
      mapsQuery: "Mar.Uchi Coffee %26 Tea, Carrer d'Arcadi Balaguer 36-38, Castelldefels",
      instagram: "https://www.instagram.com/maruchi.coffeeandtea/",
      instagramHandle: "@maruchi.coffeeandtea",
      tiktok: "https://www.tiktok.com/@maruchi.coffeeandtea",
      faveCard: "https://my.favecard.co/maruchi-coffee-tea",
      // TODO (Mateo): añade aquí el teléfono real cuando lo tengas a mano.
      phone: ""
    },

    nav: [
      { label: "Inicio", href: "index.html" },
      { label: "La Carta", href: "carta.html" },
      { label: "Nosotros", href: "sobre-nosotros.html" },
      { label: "Galería", href: "galeria.html" },
      { label: "Contacto", href: "contacto.html" }
    ]
  };
})();
