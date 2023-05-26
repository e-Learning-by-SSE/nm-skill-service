import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
 * Use only IDs in range of 2xxx to avoid conflicts with other seeds. Further proposals:
 * - Use IDs in range of 20xx - 22xx for skills
 * - Use IDs in range of 25xx+ for skill groups
 */

const repository = {
  id: '2',
  user: '1',
  name: 'Open DigiMedia',
  description: 'Example created by Luisa',
  taxonomy: 'Bloom',
  version: 'v1',
};

const skills = [
  {
    id: '2001',
    name: 'Geschichte der industriellen Produktion',
    level: 1,
  },
  {
    id: '2002',
    name: 'Definition Industrie 4.0',
  },
  {
    id: '2003',
    name: 'Einführung Digitale Transformation',
  },
  {
    id: '2004',
    name: 'Gründe Digitalisierung',
  },
  {
    id: '2005',
    name: 'Produktionsdigitalisierung',
  },
  {
    id: '2006',
    name: 'Definition Smart Factory',
  },
  {
    id: '2007',
    name: 'Definition Daten und Informationen',
  },
  {
    id: '2008',
    name: 'Daten- und Informationsflüsse im Unternehmen',
  },
  {
    id: '2009',
    name: 'Technologien der Digitalisierung',
  },
  {
    id: '2010',
    name: 'Herausforderungen bei der Umsetzung von Digitalisierungsmaßnahmen',
  },
  {
    id: '2011',
    name: 'Datenbewegung der digitalisierten Produktion',
  },
  {
    id: '2012',
    name: 'Datenarten in der Produktion',
  },
  {
    id: '2013',
    name: 'Definition Kommunikationstechnik',
  },
  {
    id: '2014',
    name: 'Definition Kommunikationsnetz',
  },
  {
    id: '2015',
    name: 'Definition Endsystem',
  },
  {
    id: '2016',
    name: 'Definition Analoge Übertragungwege',
  },
  {
    id: '2017',
    name: 'Vor- und Nachteile Analoge Übertragungswege',
  },
  {
    id: '2018',
    name: 'Anwendung Analoge Übertragungswege',
  },
  {
    id: '2019',
    name: 'Definition Digitale Übertragungswege',
  },
  {
    id: '2020',
    name: 'Vergleich der digitalen Übertragungswege',
  },
  {
    id: '2021',
    name: 'Anwendung Digitale Übertragungswege',
  },
  {
    id: '2022',
    name: 'Definition Subsystem',
  },
  {
    id: '2023',
    name: 'Definition Schnittstelle',
  },
  {
    id: '2024',
    name: 'Definition Protokoll',
  },
  {
    id: '2025',
    name: 'Definition Informationstechnik',
  },
  {
    id: '2026',
    name: 'Definition Big Data',
  },
  {
    id: '2027',
    name: 'Definition Predictive Maintenance',
  },
  {
    id: '2028',
    name: 'Datenverarbeitung der digitalen Produktion',
  },
  {
    id: '2029',
    name: 'Definition Algorithmus',
  },
  {
    id: '2030',
    name: 'Beispiel Adaptive Routenplanung',
  },
  {
    id: '2031',
    name: 'Definition Blockchain',
  },
  {
    id: '2032',
    name: 'Potenziale Neuer Geschäftsmodelle',
  },
  {
    id: '2033',
    name: 'Beispiel Neue Geschäftsmodelle',
  },
  {
    id: '2034',
    name: 'Definition Internet der Dinge',
  },
  {
    id: '2035',
    name: 'Definition Cloud Computing',
  },
  {
    id: '2036',
    name: 'Definition Datenschutz',
  },
  {
    id: '2037',
    name: 'Definition Datensicherheit',
  },
  {
    id: '2038',
    name: 'Definition Datenhoheit',
  },
  {
    id: '2039',
    name: 'Definition Daten Compliance',
  },
  {
    id: '2040',
    name: 'Definition Arbeit 4.0',
  },
  {
    id: '2041',
    name: 'Zentrale Entwicklungen der Arbeitswelt',
  },
  {
    id: '2042',
    name: 'Definition Lean Production',
  },
  {
    id: '2043',
    name: 'Definition Lean Management',
  },
  {
    id: '2044',
    name: 'Lean Production in der Fertigung',
  },
  {
    id: '2045',
    name: 'Prinzipien der Lean Production',
  },
  {
    id: '2046',
    name: 'Definition Assistenzsysteme',
  },
  {
    id: '2047',
    name: 'Arten von Assistenzsystemen',
  },
  {
    id: '2048',
    name: 'Anwendung von Assistenzsystemen',
  },
  {
    id: '2049',
    name: 'Assistenzsysteme in der Produktion',
  },
  {
    id: '2050',
    name: 'Definition Virtuelle Realität',
  },
  {
    id: '2051',
    name: 'Definition Ergonomie',
  },
  {
    id: '2052',
    name: 'Definition Digitale Fabrik',
  },
  {
    id: '2053',
    name: 'Anwendungsbeispiele Digitale Fabrik',
  },
  {
    id: '2054',
    name: 'Digitale Methoden, Modelle und Werkzeuge',
  },
  {
    id: '2055',
    name: 'Unternehmensziele in Bezug auf die Digitale Fabrik',
  },
  {
    id: '2056',
    name: 'Grundlagen Automatisierungskomponenten',
  },
  {
    id: '2057',
    name: 'Grundlagen Mechatronik',
  },
  {
    id: '2058',
    name: 'Definition Intelligente Systeme',
  },
  {
    id: '2059',
    name: 'Definition Cyber-physisches System',
  },
  {
    id: '2060',
    name: 'Definition Cyber-physisches Produktionssystem',
  },
  {
    id: '2061',
    name: 'Definition Sensorik',
  },
  {
    id: '2062',
    name: 'Grundlagen der Sensorik',
  },
  {
    id: '2063',
    name: 'Arten von Sensoren',
  },
  {
    id: '2064',
    name: 'Sensorisches Werkstückspannsystem',
  },
  {
    id: '2065',
    name: 'Anwendung von Predicitve Maintenance',
  },
  {
    id: '2066',
    name: 'Definition Feldgerät',
  },
  {
    id: '2067',
    name: 'Definition Speicherprogrammierbare Steuerungseinheiten',
  },
  {
    id: '2068',
    name: 'Definition Industrie-Personal-Computer',
  },
  {
    id: '2069',
    name: 'Definition Smartes Feldgerät',
  },
  {
    id: '2070',
    name: 'Digitale Abbildungen',
  },
  {
    id: '2071',
    name: 'Selbststeuerung/Autonomie',
  },
  {
    id: '2072',
    name: 'Automatisierte Routenplanung',
  },
  {
    id: '2073',
    name: 'Additive Fertigungsverfahren',
  },
  {
    id: '2074',
    name: 'Anwendung der additiven Fertigungsverfahren',
  },
  {
    id: '2075',
    name: 'Definition Maschine Learning',
  },
  {
    id: '2076',
    name: 'Einsatzgebiete Maschine Learning',
  },
  {
    id: '2077',
    name: 'Definition Künstliche Intelligenz',
  },
  {
    id: '2078',
    name: 'Definition Big Data II',
  },
  {
    id: '2079',
    name: 'Geschichte von Big Data',
  },
  {
    id: '2080',
    name: '4-V-Modell',
  },
  {
    id: '2081',
    name: 'Aufgabenfelder des Datenmanagements',
  },
  {
    id: '2082',
    name: 'Methoden zur Datenanalyse',
  },
  {
    id: '2083',
    name: 'Definition Data Mining',
  },
  {
    id: '2084',
    name: 'Definition Wissen',
  },
  {
    id: '2085',
    name: 'Entstehung von Wissen',
  },
  {
    id: '2086',
    name: 'Arten von Wissen',
  },
  {
    id: '2087',
    name: 'Definition Wissensträger',
  },
  {
    id: '2088',
    name: 'Wissensentdeckungsprozes',
  },
  {
    id: '2089',
    name: 'Methoden und Problemlösungsverfahren bei Data Mining',
  },
  {
    id: '2090',
    name: 'Beispiel Datenanalyse',
  },
  {
    id: '2091',
    name: 'Risiken von Big Data für produzierende Unternehmen',
  },
  {
    id: '2092',
    name: 'Einführung Produktionsmanagement',
  },
  {
    id: '2093',
    name: 'Definition Produktionsplanung und -steuerung',
  },
  {
    id: '2094',
    name: 'Beispiel Lieferkettenmodell',
  },
  {
    id: '2095',
    name: 'Einführung in ERP',
  },
  {
    id: '2096',
    name: 'Einführung in MES',
  },
  {
    id: '2097',
    name: 'Einführung in BDE',
  },
  {
    id: '2098',
    name: 'Softwaresystem ERP',
  },
  {
    id: '2099',
    name: 'Softwaresystem MES',
  },
  {
    id: '2100',
    name: 'Softwaresystem BDE',
  },
  {
    id: '2101',
    name: 'Einführung von Softwaresystemen',
  },
  {
    id: '2102',
    name: 'Abweichungen zwischen Ist- und Soll-Zustand',
  },
  {
    id: '2103',
    name: 'Schwachstellen ausgleichen mit MES',
  },
  {
    id: '2104',
    name: 'Datenversorgung von MES',
  },
  {
    id: '2105',
    name: 'Beispiel Industrie 4.0, Digitalisierung und Vernetzung',
  },
  {
    id: '2106',
    name: 'Definition Lean Management II',
  },
  {
    id: '2107',
    name: 'Prinzipien des Lean Managements',
  },
  {
    id: '2108',
    name: 'Ziele des Lean Managements',
  },
  {
    id: '2109',
    name: 'Formen der Verschwendung',
  },
  {
    id: '2110',
    name: 'Definition 5S-Methodde',
  },
  {
    id: '2111',
    name: '5S-Methodenschritte',
  },
  {
    id: '2112',
    name: 'Definition Kanban',
  },
  {
    id: '2113',
    name: 'Durchführung von Kanban',
  },
  {
    id: '2114',
    name: 'Voraussetzungen für Kanban',
  },
  {
    id: '2115',
    name: 'Definition Wertstrommethode',
  },
  {
    id: '2116',
    name: 'Erfolgsfaktoren der Wertstrommethode',
  },
  {
    id: '2117',
    name: 'Durchführung der Wertstrommethode',
  },
  {
    id: '2118',
    name: 'Vorteile der Wertstrommethode',
  },
  {
    id: '2119',
    name: 'Wertstromdarstellung',
  },
  {
    id: '2120',
    name: 'Definition PDCA-Zyklus',
  },
  {
    id: '2121',
    name: 'Phasen des PDCA-Zyklus',
  },
  {
    id: '2122',
    name: 'Vor- und Nachteile des PDCA-Zyklus',
  },
  {
    id: '2123',
    name: 'Definition Poka Yoke',
  },
  {
    id: '2124',
    name: 'Durchführung von Poka Yoke',
  },
  {
    id: '2125',
    name: 'Anwendung von Poka Yoke',
  },
  {
    id: '2126',
    name: 'Definition Just-in-Time',
  },
  {
    id: '2127',
    name: 'Voraussetzungen für Just-in-Time',
  },
  {
    id: '2128',
    name: 'Anwendung von Just-in-Time',
  },
  {
    id: '2129',
    name: 'Vor- und Nachteile von Just-in-Time',
  },
  {
    id: '2130',
    name: 'Definition FIFO',
  },
  {
    id: '2131',
    name: 'Anwendung von FIFO',
  },
  {
    id: '2132',
    name: 'FIFO-Regale',
  },
  {
    id: '2133',
    name: 'Vor- und Nachteile von FIFO',
  },
  {
    id: '2134',
    name: 'Definition Spaghetti-Diagramm',
  },
  {
    id: '2135',
    name: 'Ziele des Spaghetti-Diagramms',
  },
  {
    id: '2136',
    name: 'Anwendung des Spaghetti-Diagramms',
  },
  {
    id: '2137',
    name: 'Durchführung des Spaghetti-Diagramms',
  },
  {
    id: '2138',
    name: 'Physikalische Grundlagen der Lasertechnik',
  },
  {
    id: '2139',
    name: 'Eigenschaften eines Lasers',
  },
  {
    id: '2140',
    name: 'Fertigungsprozesse mit Lasern',
  },
  {
    id: '2141',
    name: 'Parameter der Lasertechnik',
  },
  {
    id: '2142',
    name: 'Beispiel Lasertechnik für Informationsbereitstellung',
  },
  {
    id: '2143',
    name: 'Definition Additive Manufacturing',
  },
  {
    id: '2144',
    name: 'Geschichte der additiven Fertigung',
  },
  {
    id: '2145',
    name: 'Vorteile der additiven Fertigung',
  },
  {
    id: '2146',
    name: 'Einsatzbereiche der additiven Fertigug',
  },
  {
    id: '2147',
    name: 'Prozesskette der additiven Fertigung',
  },
  {
    id: '2148',
    name: 'Nachbehandlung der 3D-Teile',
  },
  {
    id: '2149',
    name: 'Produkt-Regeneration',
  },
  {
    id: '2150',
    name: 'Beispiel Autonome Reparatur von Turbinenschaufeln',
  },
  {
    id: '2151',
    name: 'Belastungsarten',
  },
  {
    id: '2152',
    name: 'Formen von Assistenzsystemen',
  },
  {
    id: '2153',
    name: 'Ziele von Assistenzsystemen',
  },
  {
    id: '2154',
    name: 'Assistenzsysteme in der Fertigung',
  },
  {
    id: '2155',
    name: 'Reduzierung von Belastungen',
  },
  {
    id: '2156',
    name: 'Definition Künstliche Intelligenz II',
  },
  {
    id: '2157',
    name: 'Beispiel Assistent für virtuelle Prozess-Inbetriebnahme',
  },
  {
    id: '2158',
    name: 'Steuerung von Assistenzsystemen',
  },
  {
    id: '2159',
    name: 'Sensorik von Assistenzsystemen',
  },
  {
    id: '2160',
    name: 'Aktorik von Assistenzsystemen',
  },
  {
    id: '2161',
    name: 'Definition Sensor',
  },
  {
    id: '2162',
    name: 'Entwicklung von Sensoren',
  },
  {
    id: '2163',
    name: 'Definition Messtechnik',
  },
  {
    id: '2164',
    name: 'SI-Einheiten',
  },
  {
    id: '2165',
    name: 'Analoge und digitale Signale',
  },
  {
    id: '2166',
    name: 'Analog-/Digital-Wandler',
  },
  {
    id: '2167',
    name: 'Funktionsprinzip von Messeinrichtungen',
  },
  {
    id: '2168',
    name: 'Definition Kalibrieren, Justieren, Eichen',
  },
  {
    id: '2169',
    name: 'Messabweichungen',
  },
  {
    id: '2170',
    name: 'Aktive und passive Sensoren',
  },
  {
    id: '2171',
    name: 'Messprinzipien von Sensoren',
  },
  {
    id: '2172',
    name: 'Fahrerlose Transportsysteme',
  },
  {
    id: '2173',
    name: 'Definition Sensoren zur Kraftmessung',
  },
  {
    id: '2174',
    name: 'Aufbau eines Dehnungsmessstreifens',
  },
  {
    id: '2175',
    name: 'Beispiel Sensorisches Wertstückspannsystem',
  },
  {
    id: '2176',
    name: 'Beispiel Fühlende Maschine',
  },
  {
    id: '2177',
    name: 'Definition Sensoren zur Temperaturmessung',
  },
  {
    id: '2178',
    name: 'Definition Kaltleiter',
  },
  {
    id: '2179',
    name: 'Definition Heißleiter',
  },
  {
    id: '2180',
    name: 'Beispiel Fühlende Maschine II',
  },
  {
    id: '2181',
    name: 'Definition Sensoren zur Schwingungsmessung',
  },
  {
    id: '2182',
    name: 'Funktionsprinzip eines induktiven Sensors zur Schwingungsmessung',
  },
  {
    id: '2183',
    name: 'Definition Sensoren zur Längenvermessung',
  },
  {
    id: '2184',
    name: 'Aufbau einer Einweglichtschranke',
  },
  {
    id: '2185',
    name: 'Beispiel Einsatz Einweglichtschranke in KI-Demonstrator',
  },
  {
    id: '2186',
    name: 'Definition Innerbetrieblicher Materialfluss',
  },
  {
    id: '2187',
    name: 'Tools und Prinzipien beim innerbetrieblichen Materialfluss',
  },
  {
    id: '2188',
    name: 'Fertigungsprinzipien',
  },
  {
    id: '2189',
    name: 'Planung und Steuerung des innerbetrieblichen Materialflusses',
  },
  {
    id: '2190',
    name: 'Simulationsmodelle',
  },
  {
    id: '2191',
    name: 'Definition Materialflusssimulation',
  },
  {
    id: '2192',
    name: 'Verifizierung und Validierung des Simulationsmodells',
  },
  {
    id: '2193',
    name: 'Schritte der Materialflusssimulation',
  },
  {
    id: '2194',
    name: 'Einsatzbereiche von Materialflusssimulationen',
  },
  {
    id: '2195',
    name: 'Definition RFID',
  },
  {
    id: '2196',
    name: 'Komponenten von RFID',
  },
  {
    id: '2197',
    name: 'Funktionsweise von RFID',
  },
  {
    id: '2198',
    name: 'Einsatzbereiche von RFID',
  },
  {
    id: '2199',
    name: 'Beispiel World-RFID-Paletten',
  },
  {
    id: '2200',
    name: 'Vorteile der Verwendung von RFID',
  },
  {
    id: '2201',
    name: 'Risiken bei der Verwendung von RFID',
  },
  {
    id: '2202',
    name: 'Ausblick von RFID',
  },
];

const skillGroups = [
  {
    id: '2501',
    level: 1,
    name: 'Grundlagen Industrie 4.0',
    description: undefined,
    nested: ['2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010'],
  },
  {
    id: '2502',
    name: 'Grundlagen Daten und Informationen',
    nested: [
      '2013',
      '2014',
      '2015',
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
      '2023',
      '2024',
      '2025',
      '2026',
      '2027',
      '2028',
      '2029',
      '2030',
      '2031',
      '2032',
      '2033',
      '2034',
      '2035',
      '2036',
      '2037',
      '2038',
      '2039',
    ],
  },
  {
    id: '2503',
    name: 'Grundlagen Arbeit 4.0',
    nested: ['2040', '2041', '2042', '2043', '2044', '2045', '2046', '2047', '2048', '2049', '2050', '2051'],
  },
  {
    id: '2504',
    name: 'Grundlagen Produktionstechnik',
    nested: [
      '2052',
      '2053',
      '2054',
      '2055',
      '2056',
      '2057',
      '2058',
      '2059',
      '2060',
      '2061',
      '2062',
      '2063',
      '2064',
      '2065',
      '2066',
      '2067',
      '2068',
      '2069',
      '2070',
      '2071',
      '2072',
      '2073',
      '2074',
      '2075',
      '2076',
      '2077',
    ],
  },
  {
    id: '2505',
    name: 'Big Data',
    nested: [
      ,
      '2078',
      '2079',
      '2080',
      '2081',
      '2082',
      '2083',
      '2084',
      '2085',
      '2086',
      '2087',
      '2088',
      '2089',
      '2090',
      '2091',
    ],
  },
  {
    id: '2506',
    name: 'Produktionsplanung und -steuerung',
    nested: [
      '2092',
      '2093',
      '2094',
      '2095',
      '2096',
      '2097',
      '2098',
      '2099',
      '2100',
      '2101',
      '2102',
      '2103',
      '2104',
      '2105',
    ],
  },
  {
    id: '2507',
    name: 'Werkzeugkoffer 4.0',
    nested: [
      '2106',
      '2107',
      '2108',
      '2109',
      '2110',
      '2111',
      '2112',
      '2113',
      '2114',
      '2115',
      '2116',
      '2117',
      '2118',
      '2119',
      '2120',
      '2121',
      '2122',
      '2123',
      '2124',
      '2125',
      '2126',
      '2127',
      '2128',
      '2129',
      '2130',
      '2131',
      '2132',
      '2133',
      '2134',
      '2135',
      '2136',
      '2137',
    ],
  },
  {
    id: '2508',
    name: 'Fertigung 4.0',
    nested: ['2138', '2139', '2140', '2141', '2142', '2143', '2144', '2145', '2146', '2147', '2148', '2149', '2150'],
  },
  {
    id: '2509',
    name: 'Assistenzsysteme',
    nested: ['2151', '2152', '2153', '2154', '2155', '2156', '2157', '2158', '2159', '2160'],
  },
  {
    id: '2510',
    name: 'Sensorik',
    nested: [
      '2161',
      '2162',
      '2163',
      '2164',
      '2165',
      '2166',
      '2167',
      '2168',
      '2169',
      '2170',
      '2171',
      '2172',
      '2173',
      '2174',
      '2175',
      '2176',
      '2177',
      '2178',
      '2179',
      '2180',
      '2181',
      '2182',
      '2183',
      '2184',
      '2185',
    ],
  },
  {
    id: '2511',
    name: 'Grundlagen innerbetrieblicher Materialfluss',
    nested: ['2186', '2187', '2188', '2189', '2190', '2191', '2192', '2193', '2194'],
  },
  {
    id: '2512',
    name: 'RFID',
    nested: ['2195', '2196', '2197', '2198', '2199', '2200', '2201', '2202'],
  },
];

const learningObjectives = [
  // Chapter 1
  {
    id: 2001,
    name: 'Wandel der Industrie',
    description:
      'Die Lernenden können zentrale technische Veränderungen in der Industrie geschichtlich einordnen und den Begriff Industrie 4.0 erklären.',
    requirements: [],
    teachingGoals: ['2001', '2002'],
  },
  {
    id: 2002,
    name: 'Digitale Transformation',
    description:
      'Die Lernenden können die Einführung in die digitale Transformation darstellen sowie die wesentlichen Gründe für die zunehmende Digitalisierung in der Produktion erklären.',
    requirements: ['2002'],
    teachingGoals: ['2003', '2004', '2005'],
  },
  {
    id: 2003,
    name: 'Daten- und Informationsflüsse in der Smart Factory',
    description:
      'Die Lernenden können die Begriffe Smart Factory, Daten und Informationen erklären sowie Daten- und Informationsflüsse in Unternehmen darstellen.',
    requirements: ['2005'],
    teachingGoals: ['2006', '2007', '2008'],
  },
  {
    id: 2004,
    name: 'Technologien der Industrie 4.0',
    description:
      'Die Lernenden können grundlegende Technologien und Methoden der Digitalisierung in der Produktion benennen.',
    requirements: ['2008'],
    teachingGoals: ['2009'],
  },
  {
    id: 2005,
    name: 'Lerneinheit 1.5',
    description:
      'Die Lernenden können Möglichkeiten zur Umsetzung von Digitalisierungsmaßnahmen sowie Handlungsoptionen zu Herausforderungen benennen.',
    requirements: ['2004'],
    teachingGoals: ['2010'],
  },
  // Chapter 2
  {
    id: 2006,
    name: 'Datenbewegung in der digitalisierten Produktion',
    description: 'Die Lernenden können die Datenbewegung in der digitalisierten Produktion erklären.',
    requirements: ['2009'],
    teachingGoals: ['2011'],
  },
  {
    id: 2007,
    name: 'Betriebsdaten in der Produktion',
    description: 'Die Lernenden können verschiedene Datenarten in der Produktion benennen und unterscheiden.',
    requirements: ['2011'],
    teachingGoals: ['2012'],
  },
  {
    id: 2008,
    name: 'Grundlagen der Kommunikationstechnik',
    description:
      'Die Lernenden können die Grundlagen der Kommunikationstechnik benennen sowie die Begriffe Kommunikationstechnik, Kommunikationsnetz und Endsystem erklären.',
    requirements: ['2012'],
    teachingGoals: ['2013', '2014', '2015'],
  },
  {
    id: 2009,
    name: 'Analoge Übertragungswege in der Produktion',
    description:
      'Die Lernenden können analoge Übertragungswege, deren Vor- und Nachteile sowie verschiedene Anwendungsbeispiele von analogen Übertragungswegen erklären.',
    requirements: ['2013'],
    teachingGoals: ['2016', '2017', '2018'],
  },
  {
    id: 2010,
    name: 'Digitale Übertragungswege in der Produktion',
    description:
      'Die Lernenden können digitale Übertragungswege, deren Vor- und Nachteile sowie verschiedene Anwendungsbeispiele von digitalen Übertragungswegen erklären.',
    requirements: ['2013'],
    teachingGoals: ['2019', '2020', '2021'],
  },
  {
    id: 2011,
    name: 'Subsysteme, Schnittstellen und Protokolle',
    description:
      'Die Lernenden können die Begriffe Subsystem, Schnittstelle und Protokoll erklären und in den Bereich der Kommunikationstechnik einordnen.',
    requirements: ['2013'],
    teachingGoals: ['2022', '2023', '2024'],
  },
  {
    id: 2012,
    name: 'Grundlagen der Informationstechnik',
    description:
      'Die Lernenden können die Begriffe Informationstechnik, Big Data sowie Predictive Maintenance erklären und in den Bereich der Kommunikations- und Informationstechnik einordnen.',
    requirements: ['2013'],
    teachingGoals: ['2025', '2026', '2027'],
  },
  {
    id: 2013,
    name: 'Datenverarbeitung in der digitalen Produktion',
    description:
      'Die Lernenden können die Datenverarbeitung der digitalen Produktion und den Zusammenhang zu Algorithmen erklären.',
    requirements: ['2011'],
    teachingGoals: ['2028', '2029', '2030'],
  },
  {
    id: 2014,
    name: 'IT-Sicherheit und Blockchain',
    description:
      'Die Lernenden können den Begriff Blockchain erklären und in den Bereich der Informationstechnik einordnen.',
    requirements: ['2025'],
    teachingGoals: ['2031'],
  },
  {
    id: 2015,
    name: 'Neue Geschäftsmodelle der Digitalisierung',
    description: 'Die Lernenden können Gründe und Beispiele für neue digitale Geschäftsmodelle benennen.',
    requirements: ['2004'],
    teachingGoals: ['2032', '2033'],
  },
  {
    id: 2016,
    name: 'Technologien der neuen Geschäftsmodelle',
    description: 'Die Lernenden können die Begriffe Internet der Dinge und Cloud Computing erklären.',
    requirements: [],
    teachingGoals: ['2034', '2035'],
  },
  {
    id: 2017,
    name: 'Daten als Unternehmenswert',
    description:
      'Die Lernenden können die Begriffe Datenschutz, Datensicherheit, Datenhoheit und Daten Compliance erklären.',
    requirements: ['2007'],
    teachingGoals: ['2036', '2037', '2038', '2039'],
  },
  // Chapter 3
  {
    id: 2018,
    name: 'Veränderungen in der Arbeitswelt: Arbeit 4.0',
    description:
      'Die Lernenden können den Begriff Arbeit 4.0 erklären und zentrale Entwicklungen der Arbeitswelt benennen.',
    requirements: ['2004'],
    teachingGoals: ['2040', '2041'],
  },
  {
    id: 2019,
    name: 'Einführung in die Lean Production',
    description:
      'Die Lernenden können die Begriffe Lean Production und Lean Management erklären sowie die Prinzipien der Lean Production in der Fertigung benennen.',
    requirements: ['2041'],
    teachingGoals: ['2042', '2043', '2044', '2045'],
  },
  {
    id: 2020,
    name: 'Einführung in Assistenzsysteme',
    description: 'Die Lernenden können Assistenzsysteme sowie deren verschiedener Arten und Anwendung erklären.',
    requirements: ['2009'],
    teachingGoals: ['2046', '2047', '2048'],
  },
  {
    id: 2021,
    name: 'Anwendung von Assistenzsystemen',
    description:
      'Die Lernenden können verschiedene Assistenzsysteme in der Prodution sowie deren Zusammenhang zwischen virtueller Realität und Ergonomie erklären.',
    requirements: ['2047', '2049', '2041'],
    teachingGoals: ['2049', '2050', '2051'],
  },
  //Chapter 4
  {
    id: 2022,
    name: 'Digitale Methoden, Modelle und Werkzeuge in der Fertigung',
    description:
      'Die Lernenden können erklären, was unter einer Digitalen Fabrik zu verstehen ist sowie Anwendungsbeispiele, verschiedene Methoden, Modelle und Werkzeuge und Unternehmensziele in Bezug auf die Digitale Fabrik benennen.',
    requirements: [],
    teachingGoals: ['2052', '2053', '2054', '2055'],
  },
  {
    id: 2023,
    name: 'Automatisierungskomponenten',
    description:
      'Die Lernenden können die Grundlagen der Automatisierungskomponenten und Mechatronik sowie die Begriffe Intelligente Systeme, Cyber-physisches System und Cyber-physisches Produktionssystem erklären.',
    requirements: ['2025', '2052'],
    teachingGoals: ['2056', '2057', '2058', '2059', '2060'],
  },
  {
    id: 2024,
    name: 'Einführung in die Sensorik',
    description:
      'Die Lernenden können den Begriff der Sensorik und weitere Grundlagen erklären sowie verschiedene Arten von Sensoren benennen.',
    requirements: [],
    teachingGoals: ['2061'],
  },
  {
    id: 2025,
    name: 'Sensorik: Anwendungsbeispiele',
    description:
      'Die Lernenden können Anwendungsbeispiele zum sensorischen Werkstückspannsystem und Predictive Maintenance beschreiben.',
    requirements: ['2027', '2063'],
    teachingGoals: ['2064', '2065'],
  },
  {
    id: 2026,
    name: 'Klassische Steuerungssysteme',
    description:
      'Die Lernenden können Feldgeräte, speicherprogrammierbare Steuerungseinheiten und Industrie-Personal-Computer erklären.',
    requirements: ['2056'],
    teachingGoals: ['2066', '2067', '2068'],
  },
  {
    id: 2027,
    name: "Neue 'digitale' Steuerungssysteme",
    description:
      'Die Lernenden können smarte Feldgeräte erklären sowie die Wichtigkeit von digitalen Abbildern, der Selbststeuerung und automatisierten Routenplanungen benennen.',
    requirements: ['2066'],
    teachingGoals: ['2069', '2070', '2071', '2072'],
  },
  {
    id: 2028,
    name: 'Einführung in die Fertigung 4.0',
    description: 'Die Lernenden können additive Fertigungsverfahren und deren Anwendung in der Produktion erklären.',
    requirements: [],
    teachingGoals: ['2073', '2074'],
  },
  {
    id: 2029,
    name: "'Neue' Methoden der Produktionstechnik",
    description:
      'Die Lernenden können die Begriffe Maschine Learning und Künstliche Intelligenz erklären sowie Einsatzgebiete des Maschine Learnings benennen.',
    requirements: [],
    teachingGoals: ['2075', '2076', '2077'],
  },
  // Chapter 5
  {
    id: 2030,
    name: 'Definition und Entwicklung von Big Data',
    description: 'Die Lernenden können den Begriff Big Data, dessen Entwicklung sowie das 4-V-Modell erklären.',
    requirements: ['2025', '2026'],
    teachingGoals: ['2078', '2079', '2080'],
  },
  {
    id: 2031,
    name: 'Datenmanagement von Big Data',
    description:
      'Die Lernenden können die Aufgabenfelder des Datenmanagements sowie verschiedene Methoden zur Datenanalyse erklären.',
    requirements: ['2080'],
    teachingGoals: ['2081', '2082'],
  },
  {
    id: 2032,
    name: 'Big Data: Informationen und Wissen',
    description:
      'Die Lernenden können Data Mining und Wissen sowie deren Entstehung, verschiedene Wissensarten und Wissensträger erklären.',
    requirements: ['2026'],
    teachingGoals: ['2083', '2084', '2085', '2086', '2087'],
  },
  {
    id: 2033,
    name: 'Wissen entdecken mit Big Data und Data Mining',
    description:
      'Die Lernenden können die einzelnen Schritte des Wissensentdeckungsprozesses sowie die grundlegenden Aufgaben, Verfahren und Versuchsdurchführungen des Data Mining erklären.',
    requirements: ['2086'],
    teachingGoals: ['2088', '2089'],
  },
  {
    id: 2034,
    name: 'Anwendung und Risiken von Big Data',
    description:
      'Die Lernenden können beschreiben, wie eine beispielhafte Datenanalyse vorgenommen wird und welche Risiken von Big Data für produzierende Unternehmen bestehen.',
    requirements: [],
    teachingGoals: ['2090', '2091'],
  },
  // Chapter 6
  {
    id: 2035,
    name: 'Einführung in das Produktionsmanagement',
    description:
      'Die Lernenden können eine Einführung in das Produktionsmanagement geben, die Begriffe Produktionsplanung und Produktionssteuerung erklären sowie ein beispielhaftes Lieferkettenmodell beschreiben.',
    requirements: [],
    teachingGoals: ['2092', '2093', '2094'],
  },
  {
    id: 2036,
    name: 'Produktionsmanagement: Einordnung der Systeme',
    description:
      'Die Lernenden können die Softwaresysteme ERP, MES und BDE in die Thematik des Produktionsmanagements einordnen und erklären.',
    requirements: ['2093'],
    teachingGoals: ['2095', '2096', '2097'],
  },
  {
    id: 2037,
    name: 'Softwaresysteme: ERP, MES und BDE',
    description:
      'Die Lernenden können die Zusammenhänge zwischen den Softwaresystemen ERP, MES und BDE benennen sowie die Aufgabenbereiche und Funktionen erklären.',
    requirements: ['2095', '2096', '2097'],
    teachingGoals: ['2098', '2099', '2100'],
  },
  {
    id: 2038,
    name: 'Softwaresysteme: Herausforderungen bei der Einführung',
    description:
      'Die Lernenden können die Gründe für die Einführung von Softwaresystemen, die Abweichungen des Ist-Zustands vom Soll-Zustand in der Produktion, wie die Datenversorgung von MES geschieht und wie mithilfe von MES Schwachstellen ausgeglichen werden, benennen.',
    requirements: ['2093', '2099'],
    teachingGoals: ['2101', '2102', '2103', '2104'],
  },
  {
    id: 2039,
    name: 'PPS: Blick in die Forschung',
    description:
      'Die Lernenden können die Themen Industrie 4.0, Digitalisierung und Vernetzung anhand eines Beispiels beschreiben.',
    requirements: ['2093'],
    teachingGoals: ['2105'],
  },
  // Chapter 7
  {
    id: 2040,
    name: 'Lean Management',
    description:
      'Die Lernenden können das Lean Management sowie dessen Prinzipien und Ziele erklären sowie Formen der Verschwendung benennen.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2041,
    name: 'Lean Management: 5S-Methode',
    description: 'Die Lernenden können die 5S-Methode sowie deren Methodenschritte erläutern.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2042,
    name: 'Lean Management: Kanban',
    description: 'Die Lernenden können die Kanban-Methode sowie deren Durchführung und Voraussetzungen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2043,
    name: 'Lean Management: Wertstrommethode',
    description:
      'Die Lernenden können die Wertstrommethode, deren Erfolgsfaktoren, Durchführung und Vorteile sowie die Darstellung des Wertstroms erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2044,
    name: 'Lean Management: PDCA-Zyklus',
    description: 'Die Lernenden können den PDCA-Zyklus, dessen Phasen sowie Vor- und Nachteile erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2045,
    name: 'Lean Management: Poka Yoke',
    description: 'Die Lernenden können die Poka Yoke Technik sowie deren Durchführung und Anwendungsformen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2046,
    name: 'Lean Management: Just-in-Time',
    description:
      'Die Lernenden können das Just-in-Time-Konzept sowie dessen Voraussetzungen, Anwendungsformen und Vor- und Nachteile erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2047,
    name: 'Lean Management: FIFO-Prinzip',
    description:
      'Die Lernenden können das FIFO-Prinzip, dessen Anwendungsformen, verschiedene Arten von FIFO-Regalen sowie Vor- und Nachteile erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2048,
    name: 'Lean Management: Spaghetti-Diagramm',
    description:
      'Die Lernenden können das Spaghetti-Diagramm, deren Ziele, Anwendungsformen sowie die Durchführung der Methode erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2049,
    name: 'Physik des Lasers',
    description:
      'Die Lernenden können die wichtigsten physikalischen Grundlagen der Lasertechnik sowie Eigenschaften eines Lasers beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2050,
    name: 'Laser in der Fertigung',
    description:
      'Die Lernenden können einen Überblick über die verschiedenen Fertigungsprozesse mit Lasern geben sowie Parameter der Lasertechnik und ein Beispiel für die Informationsbereitstellung beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2051,
    name: 'Additive Fertigung: Einführung',
    description:
      'Die Lernenden können die additive Fertigung und deren Geschichte, Vorteile sowie Einsatzbereiche erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2052,
    name: 'Additive Fertigung: Prozesskette',
    description:
      'Die Lernenden können die Prozesskette inklusive Nachbehandlung der additiven Fertigung erklären und zwei Beispiele von additiv gefertigten Bauteilen beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2053,
    name: 'Assistenzsysteme: Der Mensch',
    description:
      'Die Lernenden können verschiedene Belastungsarten sowie Formen und Ziele von Assistenzsystemen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2054,
    name: 'Assistenzsysteme: Die Technik',
    description:
      'Die Lernenden können erklären, welche Automatisierungslösungen und Assistenten physische Belastungen reduzieren können und erhalten einen Einblick in die Künstliche Intelligenz und Forschung.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2055,
    name: 'Assistenzsysteme: Technische Komponenten',
    description:
      'Die Lernenden können verschiedene Beispiele für Komponenten von Assistenzsystemen aus den Bereichen Steuerung, Sensorik und Aktorik erläutern.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2056,
    name: 'Grundlagen der Sensorik',
    description:
      'Die Lernenden können erklären, was unter Sensorik bzw. einem Sensor zu verstehen ist und wie die Entwicklung von Sensoren verläuft.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2057,
    name: 'Grundlagen der Messtechnik',
    description:
      'Die Lernenden können den Begriff der Messtechnik, einige Größen des SI-Einheitensystems sowie die Signale und Funktionsweise von Analog-Digital-Wandlern erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2058,
    name: 'Funktionsprinzip von Messeinrichtungen',
    description:
      'Die Lernenden können das Funktionsprinzip von Messeinrichtungen, die Begriffe Kalibrieren, Justieren und Eichen sowie die daraus resultierenden Arten von Messabweichungen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2059,
    name: 'Arten von Sensoren',
    description:
      'Die Lernenden können aktive und passive Sensoren unterscheiden sowie verschiedene Messprinzipien von Sensoren und den Begriff Aktorik in Verbindung mit fahrerlosen Transportsystemen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2060,
    name: 'Sensoren zur Kraftmessung',
    description:
      'Die Lernenden können Sensoren zur Kraftmessung und den Aufbau eines Dehnungsmessstreifens erklären sowie Beispiele aus der Forschung, wie sensorische Wertstückspannsysteme und fühlende Maschinen, beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2061,
    name: 'Sensoren zur Temperaturmessung',
    description:
      'Die Lernenden können Sensoren zur Temperaturmessung und den Unterschied zwischen Kaltleitern und Heißleitern erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2062,
    name: 'Sensoren zur Schwingungsmessung',
    description: 'Die Lernenden können die Funktion und den Aufbau von Sensoren zur Schwingungsmessung erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2063,
    name: 'Sensoren zur Längenvermessung',
    description:
      'Die Lernenden können die Funktion und den Aufbau von Sensoren zur Längenvermessung sowie den Aufbau einer Einweglichtschranke erklären und ein Beispiel für den Einsatz der Einweglichtschranke in einem KI-Demonstrator beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2064,
    name: 'Darstellung des innerbetrieblichen Materialflusses',
    description:
      'Die Lernenden können den innerbetrieblichen Materialfluss erklären und verschiedene Darstellungsformen des Materialflusses beschreiben.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2065,
    name: 'Fertigungsprinzipien des innerbetrieblichen Materialflusses',
    description:
      'Die Lernenden können unterschiedliche Fertigungsprinzipien, Simulationsmodelle sowie die Planung und Steuerung des innerbetrieblichen Materialflusses erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2066,
    name: 'Funktionen von Materialflusssimulationen',
    description:
      'Die Lernenden können den Begriff der Materialflusssimulation, deren Phasen sowie die Handhabung der Verifizierung und Validierung eines Simulationsmodells erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2067,
    name: 'Anwendung von Materialflusssimulationen',
    description: 'Die Lernenden können verschiedene Einsatzbereiche von Materialflusssimulationen erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2068,
    name: 'Komponenten und Funktionsweise von RFID',
    description: 'Die Lernenden können den Begriff RFID sowie die Komponenten und Funktionsweise von RFID erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2069,
    name: 'Einsatzmöglichkeiten von RFID',
    description: 'Die Lernenden können verschiedene Einsatzbereiche von RFID erklären.',
    requirements: [],
    teachingGoals: [],
  },
  {
    id: 2070,
    name: 'Chancen und Risiken von RFID',
    description:
      'Die Lernenden können erklären, welche Chancen und Risiken bei der Verwendung von RFID bestehen und einen Ausblick über das Thema geben.',
    requirements: [],
    teachingGoals: [],
  },
];

const learningGoals = [
  {
    id: '2001',
    repositoryId: '1',
    name: 'Industrie im Wandel der Zeit',
    description: undefined,
    goals: ['2501', '2502', '2503', '2504', '2505', '2506', '2507', '2508', '2509', '2510', '2511', '2512'],
  },
];

export async function digimediaSeed(): Promise<void> {
  await createRepositories();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Repositories');
  await createCompetencies();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Skills');
  await createSkillGroups();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'SkillGroups');
  await createLearningObjects();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Learning Objects');
  await createGoals();
  console.log(' - %s\x1b[32m ✔\x1b[0m', 'Goals');
}

async function createRepositories() {
  await prisma.skillMap.create({
    data: {
      id: repository.id,
      owner: repository.user,
      name: repository.name,
      description: repository.description,
      taxonomy: repository.taxonomy,
      version: repository.version,
    },
  });
}

async function createCompetencies() {
  await Promise.all(
    skills.map(async (competence) => {
      const input: Prisma.SkillUncheckedCreateInput = {
        repositoryId: repository.id,
        level: competence.level ?? 1,
        ...competence,
      };

      await prisma.skill.create({
        data: input,
      });
    }),
  );
}

async function createSkillGroups() {
  // Need to preserve ordering and wait to be finished before creating the next one!
  for (const skill of skillGroups) {
    const nested = skill.nested?.map((i) => ({ id: i }));

    await prisma.skill.create({
      data: {
        id: skill.id,
        repositoryId: repository.id,
        name: skill.name,
        description: skill.description,
        level: skill.level ?? 1,
        nestedSkills: {
          connect: nested,
        },
      },
    });
  }
}

async function createLearningObjects() {
  // Avoid Deadlocks -> Run all in sequence
  for (const unit of learningObjectives) {
    await prisma.learningUnit.create({
      data: {
        id: unit.id,
        title: unit.name,
        language: 'de',
        description: unit.description,
        requirements: {
          connect: unit.requirements.map((i) => ({ id: i })),
        },
        teachingGoals: {
          connect: unit.teachingGoals.map((i) => ({ id: i })),
        },
      },
    });
  }
}

async function createGoals() {
  // Avoid Deadlocks -> Run all in sequence
  for (const goal of learningGoals) {
    await prisma.pathGoal.create({
      data: {
        id: goal.id,
        title: goal.name,
        description: goal.description,
        pathTeachingGoals: {
          connect: goal.goals.map((i) => ({ id: i })),
        },
      },
    });
  }
}
