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
