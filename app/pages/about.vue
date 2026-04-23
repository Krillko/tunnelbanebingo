<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
    <div class="w-full max-w-lg">
      <NuxtLink to="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block">
        ← Tillbaka
      </NuxtLink>

      <h1 class="text-2xl font-bold text-gray-900 mb-1">
        Om appen
      </h1>
      <p class="text-sm text-gray-500 mb-8">
        Tunnelbana Bingo är ett hobbyprojekt för dig som vill utforska Stockholms kollektivtrafik.
      </p>

      <div class="flex flex-col gap-8">
        <section>
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Datakällor
          </h2>
          <ul class="flex flex-col gap-4 text-sm text-gray-600">
            <li>
              <span class="font-medium text-gray-800">Stationsdata</span><br>
              Stationsnamn och koordinater för tunnelbana, Tvärbanan och Spårväg City är
              sammanställda manuellt från
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">OpenStreetMap</a>.
            </li>
            <li>
              <span class="font-medium text-gray-800">Kartunderlag</span><br>
              Kartbakgrunden kommer från
              <a
                href="https://carto.com/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">CARTO</a>
              (Positron-stil) med data från
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">OpenStreetMap</a>-bidragsgivare,
              och renderas med <a
                href="https://leafletjs.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">Leaflet</a>.
            </li>
            <li>
              <span class="font-medium text-gray-800">Restauranger, barer och kaféer</span><br>
              Förslag på ställen nära vinnande station hämtas i realtid från
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">OpenStreetMap</a>
              via <a
                href="https://overpass-api.de"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline">Overpass API</a>.
              Resultaten är varken sponsrade eller granskade — de återspeglar vad frivilliga
              bidragsgivare lagt in i OpenStreetMap och kan vara inaktuella.
            </li>
          </ul>
        </section>

        <USeparator />

        <section>
          <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
            Öppen källkod
          </h2>
          <p class="text-sm text-gray-600">
            Appen är ett hobbyprojekt och källkoden finns på
            <a
              href="https://github.com/Krillko/tunnelbanebingo"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline">GitHub</a>.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
