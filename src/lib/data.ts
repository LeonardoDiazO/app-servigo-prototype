// ─────────────────────────────────────────────
// TIPOS Y ENUMS
// ─────────────────────────────────────────────

export type EquipmentStatus = "GREEN" | "YELLOW" | "RED" | "GRAY";
export type EquipmentHealth = "Crítico" | "Preventivo" | "OK";
export type ServiceOrderStatus = "Pendiente" | "En Proceso" | "Completado" | "En Ejecución" | "Asignada";
export type InventoryItemType = "generic" | "serialized";
export type InventoryStockStatus = "ok" | "low";
export type TechnicianAvailability = "Disponible" | "En servicio" | "En camino";

// ─────────────────────────────────────────────
// CLIENTES
// ─────────────────────────────────────────────

export interface IClient {
  id: string;
  name: string;
  nit: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contact: string;
  sites: { id: string; name: string; address: string }[];
}

export const clients: IClient[] = [
  {
    id: "cliente-1",
    name: "Grand Hotel Plaza",
    nit: "900.123.456-7",
    phone: "601 330 1234",
    email: "contacto@grandhotelplaza.com",
    address: "Av. El Dorado #68C-61, Bogotá",
    city: "Bogotá",
    lat: 4.6534,
    lng: -74.1027,
    contact: "Ing. Roberto Méndez",
    sites: [
      { id: "sede-1-1", name: "Sede Principal", address: "Av. El Dorado #68C-61" },
      { id: "sede-1-2", name: "Centro de Convenciones", address: "Calle 26 #69D-91" },
    ],
  },
  {
    id: "cliente-2",
    name: "Torres Corporativas Capital",
    nit: "800.987.654-3",
    phone: "601 340 5678",
    email: "admin@torrescapital.co",
    address: "Cra 7 # 71-21, Bogotá",
    city: "Bogotá",
    lat: 4.6576,
    lng: -74.0584,
    contact: "Ing. Patricia Solano",
    sites: [
      { id: "sede-2-1", name: "Torre A", address: "Cra 7 # 71-21, Piso 10" },
      { id: "sede-2-2", name: "Torre B", address: "Cra 7 # 71-21, Piso 20" },
    ],
  },
  {
    id: "cliente-3",
    name: "Centro Comercial Oasis",
    nit: "901.234.567-8",
    phone: "601 371 9012",
    email: "gerencia@ccoasis.com",
    address: "Autopista Norte Km 19, Chía",
    city: "Chía",
    lat: 4.8603,
    lng: -74.0463,
    contact: "Ing. Andrés Viloria",
    sites: [{ id: "sede-3-1", name: "Principal", address: "Autopista Norte Km 19" }],
  },
  {
    id: "cliente-4",
    name: "Clínica San Rafael",
    nit: "890.701.687-9",
    phone: "601 356 7890",
    email: "infraestructura@clinicasanrafael.co",
    address: "Calle 9 Sur #50-22, Bogotá",
    city: "Bogotá",
    lat: 4.6019,
    lng: -74.1151,
    contact: "Ing. Mario Cantillo",
    sites: [
      { id: "sede-4-1", name: "Urgencias", address: "Calle 9 Sur #50-22, Bloque A" },
      { id: "sede-4-2", name: "Quirófanos", address: "Calle 9 Sur #50-22, Bloque B" },
    ],
  },
  {
    id: "cliente-5",
    name: "Universidad Nacional",
    nit: "899.999.063-3",
    phone: "601 316 5000",
    email: "planta.fisica@unal.edu.co",
    address: "Cra 45 #26-85, Bogotá",
    city: "Bogotá",
    lat: 4.6358,
    lng: -74.0836,
    contact: "Ing. Fernando Reyes",
    sites: [{ id: "sede-5-1", name: "Ciudad Universitaria", address: "Cra 45 #26-85" }],
  },
];

// ─────────────────────────────────────────────
// EQUIPOS
// ─────────────────────────────────────────────

export interface IServiceRecord {
  date: string;
  type: "Preventivo" | "Correctivo";
  technician: string;
  description: string;
  photos: number;
  duration: string;
}

export interface IEquipment {
  id: string;
  name: string;
  location: string;
  clientId: string;
  clientName: string;
  status: EquipmentStatus;
  brand: string;
  model: string;
  serial: string;
  capacity: string;
  refrigerant: string;
  installDate: string;
  lastService: string;
  nextService: string;
  hoursOp: string;
  history: IServiceRecord[];
}

export const equipment: IEquipment[] = [
  {
    id: "eq-1",
    name: "Chiller York 500 TR",
    location: "Cuarto de máquinas P-2",
    clientId: "cliente-1",
    clientName: "Grand Hotel Plaza",
    status: "GREEN",
    brand: "York",
    model: "YLAA0500",
    serial: "YK-2019-04521",
    capacity: "500 TR",
    refrigerant: "R-134a",
    installDate: "15/Mar/2019",
    lastService: "28/Feb/2026",
    nextService: "28/May/2026",
    hoursOp: "12,450 hrs",
    history: [
      {
        date: "28/Feb/2026",
        type: "Preventivo",
        technician: "Carlos Mappale",
        description:
          "Mantenimiento preventivo completo. Lavado de serpentines, verificación de presiones (Succión: 45 PSI, Descarga: 180 PSI), limpieza de filtros, revisión de nivel de aceite. Equipo operando normal.",
        photos: 4,
        duration: "3h 20min",
      },
      {
        date: "15/Nov/2025",
        type: "Correctivo",
        technician: "Luis Fernandez",
        description:
          "Reemplazo de válvula de expansión electrónica. Se detectó baja presión de succión (28 PSI). Repuesto: Danfoss ETS250 Serial VX-2025-4410. Equipo normalizado.",
        photos: 6,
        duration: "4h 45min",
      },
      {
        date: "28/Ago/2025",
        type: "Preventivo",
        technician: "Carlos Mappale",
        description:
          "Mantenimiento preventivo trimestral. Verificación eléctrica completa, limpieza de condensador, revisión de niveles de refrigerante R-134a (OK), calibración de sensores de temperatura.",
        photos: 3,
        duration: "2h 50min",
      },
    ],
  },
  {
    id: "eq-2",
    name: "Unidad A/C Central Piso 10",
    location: "Piso 10 — Ala Este",
    clientId: "cliente-1",
    clientName: "Grand Hotel Plaza",
    status: "YELLOW",
    brand: "Carrier",
    model: "42C-020",
    serial: "CR-2021-55123",
    capacity: "20 TR",
    refrigerant: "R-410A",
    installDate: "10/Jun/2021",
    lastService: "10/Dic/2025",
    nextService: "10/Mar/2026",
    hoursOp: "6,200 hrs",
    history: [
      {
        date: "10/Dic/2025",
        type: "Preventivo",
        technician: "Ana Torres",
        description:
          "Limpieza serpentín, verificación válvula 3 vías, cambio filtro de aire. Se detectó vibración leve, programar revisión.",
        photos: 2,
        duration: "1h 30min",
      },
    ],
  },
  {
    id: "eq-3",
    name: "Sistema de Ventilación Torre A",
    location: "Sótano 1",
    clientId: "cliente-2",
    clientName: "Torres Corporativas Capital",
    status: "GREEN",
    brand: "Trane",
    model: "WLCC030",
    serial: "TR-2022-33210",
    capacity: "30,000 CFM",
    refrigerant: "Agua helada",
    installDate: "05/Mar/2022",
    lastService: "05/Mar/2026",
    nextService: "05/Jun/2026",
    hoursOp: "6,800 hrs",
    history: [
      {
        date: "05/Mar/2026",
        type: "Preventivo",
        technician: "Carlos Mappale",
        description:
          "Mantenimiento trimestral completado. Limpieza de serpentín, verificación de válvula de 3 vías, cambio de filtro de aire, medición de temperatura diferencial (ΔT: 8°C OK).",
        photos: 3,
        duration: "1h 30min",
      },
    ],
  },
  {
    id: "eq-4",
    name: "Chiller Principal",
    location: "Feria de Comida — Sótano",
    clientId: "cliente-3",
    clientName: "Centro Comercial Oasis",
    status: "RED",
    brand: "Trane",
    model: "CGAM200",
    serial: "TR-2018-44210",
    capacity: "200 TR",
    refrigerant: "R-134a",
    installDate: "10/Mar/2018",
    lastService: "05/Ene/2026",
    nextService: "Urgente",
    hoursOp: "16,100 hrs",
    history: [
      {
        date: "05/Ene/2026",
        type: "Correctivo",
        technician: "Luis Fernandez",
        description:
          "Alarma alta presión. Condensador obstruido. Compresor #2 con amperaje elevado (98A vs 85A nominal). Se requiere intervención urgente.",
        photos: 8,
        duration: "5h 00min",
      },
    ],
  },
  {
    id: "eq-5",
    name: "Bomba de Agua Torre B",
    location: "Sala de Bombas",
    clientId: "cliente-2",
    clientName: "Torres Corporativas Capital",
    status: "GREEN",
    brand: "Grundfos",
    model: "CM10-4",
    serial: "GF-2020-77120",
    capacity: "50 HP",
    refrigerant: "N/A",
    installDate: "12/Feb/2020",
    lastService: "20/Feb/2026",
    nextService: "20/May/2026",
    hoursOp: "10,200 hrs",
    history: [
      {
        date: "20/Feb/2026",
        type: "Preventivo",
        technician: "Ana Torres",
        description: "Verificación de presiones, limpieza de filtros de succión, revisión de sellos mecánicos. Operación normal.",
        photos: 2,
        duration: "1h 20min",
      },
    ],
  },
  {
    id: "eq-6",
    name: "Manejadora UCI 20K CFM",
    location: "Piso 3 — UCI",
    clientId: "cliente-4",
    clientName: "Clínica San Rafael",
    status: "YELLOW",
    brand: "Carrier",
    model: "39M-200",
    serial: "CR-2020-11832",
    capacity: "20,000 CFM",
    refrigerant: "Agua helada",
    installDate: "22/Jun/2020",
    lastService: "15/Dic/2025",
    nextService: "15/Mar/2026",
    hoursOp: "8,200 hrs",
    history: [
      {
        date: "15/Dic/2025",
        type: "Preventivo",
        technician: "Luis Fernandez",
        description:
          "Mantenimiento semestral. Cambio de filtros HEPA (eficiencia 99.97%), limpieza de bandeja de condensado, verificación de correas, medición de caudal de aire.",
        photos: 5,
        duration: "4h 00min",
      },
    ],
  },
  {
    id: "eq-7",
    name: "Chiller Carrier 400 TR",
    location: "Cuarto de máquinas S-1",
    clientId: "cliente-4",
    clientName: "Clínica San Rafael",
    status: "RED",
    brand: "Carrier",
    model: "30XA-400",
    serial: "CR-2017-99100",
    capacity: "400 TR",
    refrigerant: "R-134a",
    installDate: "05/May/2017",
    lastService: "15/Dic/2025",
    nextService: "Urgente",
    hoursOp: "17,500 hrs",
    history: [
      {
        date: "15/Dic/2025",
        type: "Correctivo",
        technician: "Luis Fernandez",
        description:
          "Fuga en evaporador. Reparación temporal. Requiere cambio de tubería completa. Equipo operando al 60% de capacidad.",
        photos: 9,
        duration: "6h 00min",
      },
    ],
  },
  {
    id: "eq-8",
    name: "Chiller McQuay 300 TR",
    location: "Planta central",
    clientId: "cliente-5",
    clientName: "Universidad Nacional",
    status: "GREEN",
    brand: "McQuay",
    model: "AWS300",
    serial: "MQ-2017-42100",
    capacity: "300 TR",
    refrigerant: "R-134a",
    installDate: "12/Ene/2017",
    lastService: "01/Mar/2026",
    nextService: "01/Jun/2026",
    hoursOp: "18,900 hrs",
    history: [
      {
        date: "01/Mar/2026",
        type: "Preventivo",
        technician: "Carlos Mappale",
        description:
          "Mantenimiento trimestral. Análisis de aceite (viscosidad OK, acidez < 0.05), limpieza de tubos de condensador, verificación de sistema de control BMS. Eficiencia 85% nominal.",
        photos: 4,
        duration: "4h 30min",
      },
      {
        date: "15/Sep/2025",
        type: "Correctivo",
        technician: "Carlos Mappale",
        description:
          "Alarma por alta presión de descarga. Causa: suciedad en condensador por temporada de lluvia. Se realizó lavado químico de emergencia. Equipo normalizado.",
        photos: 5,
        duration: "2h 15min",
      },
    ],
  },
  {
    id: "eq-9",
    name: "Mini Split Samsung 24K BTU",
    location: "Sala de juntas P-8",
    clientId: "cliente-2",
    clientName: "Torres Corporativas Capital",
    status: "RED",
    brand: "Samsung",
    model: "AR24TSHZ",
    serial: "SM-2021-77451",
    capacity: "24,000 BTU",
    refrigerant: "R-410A",
    installDate: "10/Ene/2021",
    lastService: "10/Ene/2026",
    nextService: "Urgente",
    hoursOp: "5,100 hrs",
    history: [
      {
        date: "10/Ene/2026",
        type: "Correctivo",
        technician: "Ana Torres",
        description:
          "Equipo no enfría. Diagnóstico: fuga de refrigerante en conexión de unidad exterior. Se recargó 1.2 kg de R-410A. NOTA: Se recomienda cambio de compresor, presenta ruido anormal. Cliente informado.",
        photos: 7,
        duration: "2h 30min",
      },
    ],
  },
  {
    id: "eq-10",
    name: "Fan Coil Trane 5 TR",
    location: "Biblioteca P-2",
    clientId: "cliente-5",
    clientName: "Universidad Nacional",
    status: "YELLOW",
    brand: "Trane",
    model: "WLCC050",
    serial: "TR-2021-55400",
    capacity: "5 TR",
    refrigerant: "Agua helada",
    installDate: "20/Jun/2021",
    lastService: "01/Dic/2025",
    nextService: "01/Mar/2026",
    hoursOp: "5,400 hrs",
    history: [
      {
        date: "01/Dic/2025",
        type: "Preventivo",
        technician: "Ana Torres",
        description: "Limpieza serpentín, cambio filtro, verificación válvula 3 vías, motor OK.",
        photos: 2,
        duration: "1h 20min",
      },
    ],
  },
];

// ─────────────────────────────────────────────
// TÉCNICOS
// ─────────────────────────────────────────────

export interface ITechnician {
  id: string;
  name: string;
  initials: string;
  specialization: string;
  status: TechnicianAvailability;
  zone: string;
  phone: string;
  rating: number;
  certifications: string[];
  ordersToday: number;
  ordersDoneToday: number;
  ordersThisMonth: number;
}

export const technicians: ITechnician[] = [
  {
    id: "tech-admin",
    name: "Mario Rossi",
    initials: "MR",
    specialization: "Chillers / Refrigeración industrial",
    status: "Disponible",
    zone: "Norte — Bogotá",
    phone: "301 555 1234",
    rating: 4.8,
    certifications: ["Certificado HVAC/R Nivel III", "York Chiller Specialist"],
    ordersToday: 3,
    ordersDoneToday: 2,
    ordersThisMonth: 45,
  },
  {
    id: "tech-1",
    name: "Carlos Mappale",
    initials: "CM",
    specialization: "Chillers / Torres de enfriamiento",
    status: "En servicio",
    zone: "Centro — Bogotá",
    phone: "302 555 5678",
    rating: 4.9,
    certifications: ["Certificado HVAC/R Nivel III", "McQuay Service Expert"],
    ordersToday: 4,
    ordersDoneToday: 1,
    ordersThisMonth: 55,
  },
  {
    id: "tech-2",
    name: "Luis Fernandez",
    initials: "LF",
    specialization: "Manejadoras / Ductos / Aire hospitalario",
    status: "En camino",
    zone: "Sur — Bogotá",
    phone: "305 555 9012",
    rating: 4.6,
    certifications: ["Certificado HVAC/R Nivel II", "Carrier Certified Tech"],
    ordersToday: 4,
    ordersDoneToday: 3,
    ordersThisMonth: 52,
  },
  {
    id: "tech-3",
    name: "Ana Torres",
    initials: "AT",
    specialization: "Fan Coils / Mini Splits / Residencial",
    status: "Disponible",
    zone: "Occidente — Bogotá",
    phone: "311 555 3456",
    rating: 4.7,
    certifications: ["Certificado HVAC/R Nivel II", "Samsung Authorized"],
    ordersToday: 3,
    ordersDoneToday: 1,
    ordersThisMonth: 38,
  },
];

// ─────────────────────────────────────────────
// ÓRDENES DE SERVICIO
// ─────────────────────────────────────────────

export interface IChecklistItem {
  item: string;
  done: boolean;
  value: string;
}

export interface IUsedPart {
  name: string;
  serial: string;
  qty: number;
}

export interface IServiceOrder {
  id: string;
  time: string;
  clientName: string;
  address: string;
  equipmentId: string;
  equipmentName: string;
  equipmentHealth: EquipmentHealth;
  status: ServiceOrderStatus;
  technicianId: string;
  technicianName: string;
  value?: number;
  type: "Preventivo" | "Correctivo";
  priority: "Baja" | "Media" | "Alta" | "Urgente";
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  checklist: IChecklistItem[];
  usedParts: IUsedPart[];
  clientSigned: boolean;
}

export const serviceOrders: IServiceOrder[] = [
  {
    id: "OT-2026-0312",
    time: "08:30 AM",
    clientName: "Grand Hotel Plaza",
    address: "Av. El Dorado #68C-61, Bogotá",
    equipmentId: "eq-1",
    equipmentName: "Chiller York 500 TR",
    equipmentHealth: "OK",
    status: "Completado",
    technicianId: "tech-1",
    technicianName: "Carlos Mappale",
    value: 850000,
    type: "Preventivo",
    priority: "Media",
    date: "12/Mar/2026",
    startTime: "08:30 AM",
    endTime: "11:50 AM",
    description:
      "Mantenimiento preventivo trimestral completado satisfactoriamente. Todos los parámetros dentro de rango.",
    checklist: [
      { item: "Verificar presiones de succión y descarga", done: true, value: "45/180 PSI" },
      { item: "Medir amperaje del compresor", done: true, value: "85A (nominal: 90A)" },
      { item: "Verificar nivel de aceite", done: true, value: "OK — Nivel visible" },
      { item: "Limpiar serpentín del condensador", done: true, value: "Lavado con hidrojet" },
      { item: "Verificar temperatura de agua helada", done: true, value: "Salida: 7°C / Retorno: 12°C" },
      { item: "Inspeccionar aislamiento térmico", done: true, value: "Sin deterioro" },
      { item: "Verificar funcionamiento de válvulas", done: true, value: "Operación normal" },
      { item: "Revisión de sistema eléctrico", done: true, value: "Sin anomalías" },
    ],
    usedParts: [
      { name: "Filtro de aceite", serial: "FA-2026-001", qty: 1 },
      { name: 'Filtro deshidratador 3/4"', serial: "FD-2026-044", qty: 1 },
    ],
    clientSigned: true,
  },
  {
    id: "OT-2026-0315",
    time: "09:00 AM",
    clientName: "Clínica San Rafael",
    address: "Calle 9 Sur #50-22, Bogotá",
    equipmentId: "eq-6",
    equipmentName: "Manejadora UCI 20K CFM",
    equipmentHealth: "Preventivo",
    status: "En Ejecución",
    technicianId: "tech-2",
    technicianName: "Luis Fernandez",
    value: 1200000,
    type: "Preventivo",
    priority: "Alta",
    date: "15/Mar/2026",
    startTime: "09:00 AM",
    endTime: "—",
    description:
      "Mantenimiento preventivo semestral en unidad manejadora de UCI. Requiere cambio de filtros HEPA y verificación de caudal.",
    checklist: [
      { item: "Cambiar filtros HEPA", done: true, value: "Reemplazados (eficiencia 99.97%)" },
      { item: "Verificar caudal de aire", done: true, value: "19,500 CFM (nominal: 20,000)" },
      { item: "Limpiar bandeja de condensado", done: true, value: "Completado" },
      { item: "Verificar correas del ventilador", done: false, value: "" },
      { item: "Medir presión estática", done: false, value: "" },
      { item: "Calibrar sensor de CO2", done: false, value: "" },
    ],
    usedParts: [{ name: "Filtro HEPA 24x24x12", serial: "HP-2026-088", qty: 4 }],
    clientSigned: false,
  },
  {
    id: "OT-2026-0315b",
    time: "—",
    clientName: "Torres Corporativas Capital",
    address: "Cra 7 # 71-21, Bogotá",
    equipmentId: "eq-9",
    equipmentName: "Mini Split Samsung 24K BTU",
    equipmentHealth: "Crítico",
    status: "Pendiente",
    technicianId: "",
    technicianName: "Sin asignar",
    value: undefined,
    type: "Correctivo",
    priority: "Urgente",
    date: "15/Mar/2026",
    startTime: "—",
    endTime: "—",
    description:
      "Cliente reporta que el equipo no enfría adecuadamente. Posible falla en compresor según diagnóstico previo del 10/Ene/2026. Requiere evaluación para determinar si es reparación o reemplazo.",
    checklist: [],
    usedParts: [],
    clientSigned: false,
  },
  {
    id: "OT-2026-0316",
    time: "—",
    clientName: "Centro Comercial Oasis",
    address: "Autopista Norte Km 19, Chía",
    equipmentId: "eq-4",
    equipmentName: "Chiller Principal",
    equipmentHealth: "Crítico",
    status: "Asignada",
    technicianId: "tech-3",
    technicianName: "Ana Torres",
    value: undefined,
    type: "Correctivo",
    priority: "Urgente",
    date: "16/Mar/2026",
    startTime: "—",
    endTime: "—",
    description:
      "Intervención correctiva urgente. Chiller con alarma de alta presión y compresor con amperaje elevado. Evaluar condensador y compresor #2.",
    checklist: [
      { item: "Verificar presiones de operación", done: false, value: "" },
      { item: "Medir amperaje compresores", done: false, value: "" },
      { item: "Lavar condensador", done: false, value: "" },
      { item: "Inspeccionar compresor #2", done: false, value: "" },
      { item: "Revisión eléctrica completa", done: false, value: "" },
    ],
    usedParts: [],
    clientSigned: false,
  },
  {
    id: "OT-2026-0316b",
    time: "—",
    clientName: "Clínica San Rafael",
    address: "Calle 9 Sur #50-22, Bogotá",
    equipmentId: "eq-7",
    equipmentName: "Chiller Carrier 400 TR",
    equipmentHealth: "Crítico",
    status: "Asignada",
    technicianId: "tech-2",
    technicianName: "Luis Fernandez",
    value: undefined,
    type: "Correctivo",
    priority: "Alta",
    date: "16/Mar/2026",
    startTime: "—",
    endTime: "—",
    description:
      "Fuga en evaporador. Reparación temporal previa insuficiente. Requiere cambio de tubería completa del evaporador.",
    checklist: [
      { item: "Aislar circuito refrigerante", done: false, value: "" },
      { item: "Inspeccionar evaporador completo", done: false, value: "" },
      { item: "Reemplazar tuberías del evaporador", done: false, value: "" },
      { item: "Prueba de presión post-reparación", done: false, value: "" },
      { item: "Recargar refrigerante", done: false, value: "" },
      { item: "Verificar operación al 100%", done: false, value: "" },
    ],
    usedParts: [],
    clientSigned: false,
  },
  {
    id: "OT-2026-0317",
    time: "10:00 AM",
    clientName: "Grand Hotel Plaza",
    address: "Av. El Dorado #68C-61, Bogotá",
    equipmentId: "eq-2",
    equipmentName: "Unidad A/C Central Piso 10",
    equipmentHealth: "Preventivo",
    status: "Asignada",
    technicianId: "tech-3",
    technicianName: "Ana Torres",
    value: 350000,
    type: "Preventivo",
    priority: "Media",
    date: "17/Mar/2026",
    startTime: "—",
    endTime: "—",
    description:
      "Mantenimiento preventivo vencido. Investigar vibración detectada en última visita. Cambio de filtros y limpieza general.",
    checklist: [
      { item: "Limpiar serpentín evaporador", done: false, value: "" },
      { item: "Cambiar filtro de aire", done: false, value: "" },
      { item: "Verificar motor y correas", done: false, value: "" },
      { item: "Diagnosticar fuente de vibración", done: false, value: "" },
      { item: "Verificar drenaje de condensado", done: false, value: "" },
    ],
    usedParts: [],
    clientSigned: false,
  },
];

// ─────────────────────────────────────────────
// INVENTARIO
// ─────────────────────────────────────────────

export type InventoryCategory =
  | "Compresores"
  | "Filtros"
  | "Refrigerantes"
  | "Válvulas"
  | "Eléctricos"
  | "Serpentines"
  | "Electrónica"
  | "Motores"
  | "Lubricantes";

export interface IInventoryItem {
  id: string;
  code: string;
  name: string;
  type: InventoryItemType;
  stock: number;
  minStock: number;
  maxStock: number;
  stockStatus: InventoryStockStatus;
  criticalStockLevel: number;
  category: InventoryCategory;
  location: string;
  unitPrice: string;
  lastEntry: string;
  supplier: string;
  serials?: string[];
}

export const inventory: IInventoryItem[] = [
  {
    id: "inv-1",
    code: "REP-001",
    name: "Compresor scroll Copeland 5 TR",
    type: "serialized",
    stock: 8,
    minStock: 5,
    maxStock: 15,
    stockStatus: "ok",
    criticalStockLevel: 5,
    category: "Compresores",
    location: "Bodega Principal",
    unitPrice: "$4.850.000",
    lastEntry: "01/Mar/2026",
    supplier: "Copeland Colombia",
    serials: ["COMP-001", "COMP-002", "COMP-003", "COMP-004", "COMP-005", "COMP-006", "COMP-007", "COMP-008"],
  },
  {
    id: "inv-2",
    code: "REP-002",
    name: 'Filtro deshidratador 3/4"',
    type: "generic",
    stock: 45,
    minStock: 20,
    maxStock: 80,
    stockStatus: "ok",
    criticalStockLevel: 20,
    category: "Filtros",
    location: "Bodega Principal",
    unitPrice: "$85.000",
    lastEntry: "10/Mar/2026",
    supplier: "Danfoss",
  },
  {
    id: "inv-3",
    code: "REP-003",
    name: "Gas refrigerante R-410A (kg)",
    type: "generic",
    stock: 12,
    minStock: 15,
    maxStock: 50,
    stockStatus: "low",
    criticalStockLevel: 15,
    category: "Refrigerantes",
    location: "Bodega Principal",
    unitPrice: "$45.000/kg",
    lastEntry: "20/Feb/2026",
    supplier: "Refriaméricas",
  },
  {
    id: "inv-4",
    code: "REP-004",
    name: "Válvula de expansión Danfoss TEN5",
    type: "generic",
    stock: 6,
    minStock: 4,
    maxStock: 12,
    stockStatus: "ok",
    criticalStockLevel: 4,
    category: "Válvulas",
    location: "Bodega Principal",
    unitPrice: "$320.000",
    lastEntry: "15/Mar/2026",
    supplier: "Danfoss",
  },
  {
    id: "inv-5",
    code: "REP-005",
    name: "Contactor 3P 40A 220V",
    type: "generic",
    stock: 3,
    minStock: 8,
    maxStock: 20,
    stockStatus: "low",
    criticalStockLevel: 8,
    category: "Eléctricos",
    location: "Bodega Principal",
    unitPrice: "$65.000",
    lastEntry: "05/Mar/2026",
    supplier: "Schneider Electric",
  },
  {
    id: "inv-6",
    code: "REP-006",
    name: "Serpentín evaporador 2 TR",
    type: "serialized",
    stock: 4,
    minStock: 3,
    maxStock: 8,
    stockStatus: "ok",
    criticalStockLevel: 3,
    category: "Serpentines",
    location: "Bodega Principal",
    unitPrice: "$1.200.000",
    lastEntry: "28/Feb/2026",
    supplier: "Climatec (fabricación propia)",
    serials: ["SERP-001", "SERP-002", "SERP-003", "SERP-004"],
  },
  {
    id: "inv-7",
    code: "REP-007",
    name: "Tarjeta electrónica Samsung",
    type: "serialized",
    stock: 1,
    minStock: 3,
    maxStock: 6,
    stockStatus: "low",
    criticalStockLevel: 3,
    category: "Electrónica",
    location: "Luis Fernandez",
    unitPrice: "$380.000",
    lastEntry: "10/Ene/2026",
    supplier: "Samsung HVAC Parts",
    serials: ["CTRL-A-1001"],
  },
  {
    id: "inv-8",
    code: "REP-008",
    name: "Motor ventilador 1/2 HP",
    type: "serialized",
    stock: 7,
    minStock: 5,
    maxStock: 15,
    stockStatus: "ok",
    criticalStockLevel: 5,
    category: "Motores",
    location: "Bodega Principal",
    unitPrice: "$290.000",
    lastEntry: "05/Mar/2026",
    supplier: "GE Motors",
    serials: ["MOT-001", "MOT-002", "MOT-003", "MOT-004", "MOT-005", "MOT-006", "MOT-007"],
  },
  {
    id: "inv-9",
    code: "REP-009",
    name: "Filtro HEPA 24x24x12",
    type: "generic",
    stock: 18,
    minStock: 10,
    maxStock: 40,
    stockStatus: "ok",
    criticalStockLevel: 10,
    category: "Filtros",
    location: "Bodega Principal",
    unitPrice: "$185.000",
    lastEntry: "12/Mar/2026",
    supplier: "AAF International",
  },
  {
    id: "inv-10",
    code: "REP-010",
    name: "Aceite POE 3GS (galón)",
    type: "generic",
    stock: 5,
    minStock: 4,
    maxStock: 10,
    stockStatus: "ok",
    criticalStockLevel: 4,
    category: "Lubricantes",
    location: "Bodega Principal",
    unitPrice: "$195.000",
    lastEntry: "01/Mar/2026",
    supplier: "Emkarate",
  },
];

// ─────────────────────────────────────────────
// KPI CARDS
// ─────────────────────────────────────────────

export interface KpiCardProps {
  title: string;
  metric: string;
  icon: string;
  color: "blue" | "green" | "orange" | "default";
  description: string;
  compliance?: number;
  alert?: boolean;
}

export const kpiData: KpiCardProps[] = [
  {
    title: "OS Hoy",
    metric: String(serviceOrders.length),
    icon: "ClipboardList",
    color: "blue",
    description: "Órdenes de servicio para hoy.",
  },
  {
    title: "Técnicos Activos",
    metric: String(technicians.length),
    icon: "Users",
    color: "green",
    description: "Técnicos actualmente en servicio.",
  },
  {
    title: "Equipos Críticos",
    metric: String(equipment.filter((e) => e.status === "RED").length),
    icon: "ShieldAlert",
    color: "orange",
    description: "Equipos que requieren atención inmediata.",
    alert: true,
  },
  {
    title: "% Cumplimiento SLA",
    metric: "87%",
    icon: "CheckCircle2",
    color: "blue",
    description: "+5% vs semana pasada",
    compliance: 87,
  },
];

// ─────────────────────────────────────────────
// HELPERS COMPUTADOS
// ─────────────────────────────────────────────

export const STATUS_COLORS: Record<EquipmentStatus, string> = {
  GREEN: "#10b981",
  YELLOW: "#f59e0b",
  RED:    "#ef4444",
  GRAY:   "#9ca3af",
};

export const STATUS_LABELS: Record<EquipmentStatus, string> = {
  GREEN:  "Óptimo",
  YELLOW: "Preventivo pendiente",
  RED:    "Correctivo requerido",
  GRAY:   "Fuera de servicio",
};

export const ORDER_STATUS_COLORS: Record<ServiceOrderStatus, string> = {
  Completado:    "#10b981",
  "En Ejecución": "#3b82f6",
  Asignada:      "#f59e0b",
  Pendiente:     "#ef4444",
  "En Proceso":  "#3b82f6",
};

export const INVENTORY_CATEGORY_EMOJI: Record<InventoryCategory, string> = {
  Compresores:  "🔩",
  Filtros:      "🧹",
  Refrigerantes:"❄️",
  Válvulas:     "🔧",
  Eléctricos:   "⚡",
  Serpentines:  "🌀",
  Electrónica:  "💻",
  Motores:      "⚙️",
  Lubricantes:  "🛢️",
};

/** Peor estado de los equipos de un cliente (para colorear el pin del mapa) */
export function getClientWorstStatus(clientId: string): EquipmentStatus {
  const clientEquipment = equipment.filter((e) => e.clientId === clientId);
  if (clientEquipment.some((e) => e.status === "RED")) return "RED";
  if (clientEquipment.some((e) => e.status === "YELLOW")) return "YELLOW";
  if (clientEquipment.some((e) => e.status === "GRAY")) return "GRAY";
  return "GREEN";
}

/** Contadores globales de equipos por estado */
export const equipmentCounts = equipment.reduce(
  (acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  },
  {} as Record<EquipmentStatus, number>
);
