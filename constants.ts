
import { PCComponent, ComponentClassification } from './types';

export const PC_COMPONENTS: PCComponent[] = [
  {
    id: 'cpu',
    name: 'CPU',
    classification: ComponentClassification.INTERNAL,
    color: '#60a5fa',
    scale: [1, 1, 1],
    description: 'The Central Processing Unit. The brain of the computer that handles all primary calculations.',
    sketchfabId: 'ec11f729b05848488522ba6f8c6f254f'
  },
  {
    id: 'mouse',
    name: 'Mouse',
    classification: ComponentClassification.EXTERNAL,
    color: '#6366f1',
    scale: [1, 1, 1],
    description: 'An external pointing device used to navigate and interact with the software interface.',
    sketchfabId: '6f1b4606a3bb42979b200575c8114fdb'
  },
  {
    id: 'gpu',
    name: 'GPU',
    classification: ComponentClassification.INTERNAL,
    color: '#34d399',
    scale: [1, 1, 1],
    description: 'The Graphics Processing Unit, dedicated to rendering complex images, videos, and 3D geometry.',
    sketchfabId: '22158616a1a44455917ee8e1e8fc4b09'
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    classification: ComponentClassification.EXTERNAL,
    color: '#4f46e5',
    scale: [1, 1, 1],
    description: 'An external input device that allows users to type text and issue commands.',
    sketchfabId: 'ba869e8681974cf088736173b8b86fef'
  },
  {
    id: 'ram',
    name: 'RAM',
    classification: ComponentClassification.INTERNAL,
    color: '#f472b6',
    scale: [1, 1, 1],
    description: 'Random Access Memory. It provides high-speed temporary storage for data currently in use.',
    sketchfabId: 'fbc7246466cd43a09b39e7800db69808'
  },
  {
    id: 'headphones',
    name: 'Headphones',
    classification: ComponentClassification.EXTERNAL,
    color: '#ec4899',
    scale: [1, 1, 1],
    description: 'An external audio peripheral used for private listening and communication.',
    sketchfabId: '0a26eb2aa55f47e6aebe2bf7251768f6'
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    classification: ComponentClassification.INTERNAL,
    color: '#059669',
    scale: [1, 1, 1],
    description: 'The main circuit board that facilitates communication between all hardware components.',
    sketchfabId: '61b20aee38a44d00908e851e6feea240'
  },
  {
    id: 'usb_drive',
    name: 'USB Flash Drive',
    classification: ComponentClassification.EXTERNAL,
    color: '#0ea5e9',
    scale: [1, 1, 1],
    description: 'A portable external storage device that uses flash memory to store and transfer data.',
    sketchfabId: 'b7cfb7e2809e4c64afb713140c982489'
  },
  {
    id: 'hdd',
    name: 'HDD',
    classification: ComponentClassification.INTERNAL,
    color: '#475569',
    scale: [1, 1, 1],
    description: 'Hard Disk Drive. A high-capacity internal storage device using magnetic platters.',
    sketchfabId: '8063b935c95e467f835f922190edff73'
  },
  {
    id: 'dvd',
    name: 'CD/DVD',
    classification: ComponentClassification.EXTERNAL,
    color: '#fbbf24',
    scale: [1, 1, 1],
    description: 'Optical storage media used for distributing software, movies, and music.',
    sketchfabId: 'f925c55371a347dc95250dd3fdb06823'
  },
  {
    id: 'psu',
    name: 'PSU',
    classification: ComponentClassification.INTERNAL,
    color: '#94a3b8',
    scale: [1, 1, 1],
    description: 'Power Supply Unit. It converts wall outlet power into the voltages needed by the PC.',
    sketchfabId: '11b975c08b5a4d9baa497dd734d93166'
  },
  {
    id: 'memory_card',
    name: 'Memory Card',
    classification: ComponentClassification.INTERNAL,
    color: '#ef4444',
    scale: [1, 1, 1],
    description: 'Compact flash storage often used in laptops and mobile devices for expanded storage.',
    sketchfabId: '031c319939ef48e1aa65113509b38283'
  },
  {
    id: 'fan',
    name: 'Cooling Fan',
    classification: ComponentClassification.INTERNAL,
    color: '#4b5563',
    scale: [1, 1, 1],
    description: 'An internal cooling component that prevents thermal throttling by moving air.',
    sketchfabId: '50adf2b7b06f42588825ab7f31f7ca87'
  }
];

export const INITIAL_HEARTS = 3;
