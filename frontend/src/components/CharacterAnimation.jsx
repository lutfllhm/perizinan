import { motion } from 'framer-motion';

const CharacterAnimation = ({ type }) => {
  const characters = {
    sick: {
      color: '#EF4444',
      bgColor: '#FEE2E2',
      title: 'Cuti Sakit',
      description: 'Istirahat untuk pemulihan kesehatan'
    },
    vacation: {
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      title: 'Cuti Tahunan',
      description: 'Waktu untuk refreshing dan keluarga'
    },
    early: {
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      title: 'Pulang Cepat',
      description: 'Keperluan mendesak di rumah'
    },
    late: {
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      title: 'Datang Terlambat',
      description: 'Kendala perjalanan atau keperluan'
    },
    wfh: {
      color: '#10B981',
      bgColor: '#D1FAE5',
      title: 'Work From Home',
      description: 'Bekerja dari rumah dengan produktif'
    }
  };

  const char = characters[type];

  return (
    <div className="relative">
      <svg
        width="300"
        height="350"
        viewBox="0 0 300 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Shadow */}
        <ellipse cx="150" cy="330" rx="80" ry="15" fill="black" opacity="0.1" />

        {/* Body - Shirt with IWARE Logo */}
        <motion.g
          animate={{
            y: type === 'sick' ? [0, -3, 0] : [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Legs */}
          <rect x="120" y="240" width="25" height="80" rx="12" fill="#2C3E50" />
          <rect x="155" y="240" width="25" height="80" rx="12" fill="#2C3E50" />
          
          {/* Shoes */}
          <ellipse cx="132" cy="320" rx="18" ry="8" fill="#34495E" />
          <ellipse cx="167" cy="320" rx="18" ry="8" fill="#34495E" />

          {/* Shirt Body */}
          <path
            d="M 100 140 Q 100 240 120 240 L 180 240 Q 200 240 200 140 L 200 120 Q 200 100 180 100 L 120 100 Q 100 100 100 120 Z"
            fill={char.color}
          />

          {/* Shirt Collar */}
          <path
            d="M 130 100 L 140 110 L 150 105 L 160 110 L 170 100"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />

          {/* IWARE Logo on Shirt */}
          <g transform="translate(125, 160)">
            <rect x="0" y="0" width="50" height="30" rx="5" fill="white" opacity="0.9" />
            <text
              x="25"
              y="20"
              fontSize="14"
              fontWeight="bold"
              fill={char.color}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
            >
              IWARE
            </text>
          </g>

          {/* Arms */}
          {type === 'sick' ? (
            <>
              {/* Sick - One arm holding head */}
              <motion.path
                d="M 100 130 Q 70 140 60 120"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path
                d="M 200 130 Q 220 100 210 80"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {/* Hand on head */}
              <circle cx="210" cy="75" r="12" fill="#FBBF24" />
            </>
          ) : type === 'vacation' ? (
            <>
              {/* Vacation - Arms up celebrating */}
              <motion.path
                d="M 100 130 Q 80 100 90 70"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M 200 130 Q 220 100 210 70"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Hands */}
              <circle cx="90" cy="65" r="12" fill="#FBBF24" />
              <circle cx="210" cy="65" r="12" fill="#FBBF24" />
            </>
          ) : type === 'wfh' ? (
            <>
              {/* WFH - Typing position */}
              <path
                d="M 100 130 Q 90 160 100 180"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 200 130 Q 210 160 200 180"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              {/* Hands */}
              <circle cx="100" cy="185" r="12" fill="#FBBF24" />
              <circle cx="200" cy="185" r="12" fill="#FBBF24" />
              {/* Laptop */}
              <rect x="110" y="190" width="80" height="50" rx="5" fill="#34495E" />
              <rect x="115" y="195" width="70" height="35" rx="2" fill="#60A5FA" />
            </>
          ) : type === 'early' ? (
            <>
              {/* Early - Waving goodbye */}
              <path
                d="M 100 130 Q 90 150 100 170"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d="M 200 130 Q 230 120 240 100"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {/* Hands */}
              <circle cx="100" cy="175" r="12" fill="#FBBF24" />
              <circle cx="240" cy="95" r="12" fill="#FBBF24" />
            </>
          ) : (
            <>
              {/* Late - Running position */}
              <motion.path
                d="M 100 130 Q 70 150 80 170"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, -20, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.path
                d="M 200 130 Q 230 150 220 170"
                stroke={char.color}
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              {/* Hands */}
              <circle cx="80" cy="175" r="12" fill="#FBBF24" />
              <circle cx="220" cy="175" r="12" fill="#FBBF24" />
            </>
          )}

          {/* Head */}
          <circle cx="150" cy="70" r="35" fill="#FBBF24" />

          {/* Hair */}
          <path
            d="M 115 60 Q 115 35 150 35 Q 185 35 185 60"
            fill="#2C3E50"
          />

          {/* Face */}
          {type === 'sick' ? (
            <>
              {/* Sick face - X eyes and sad mouth */}
              <path d="M 135 65 L 145 75 M 145 65 L 135 75" stroke="#E74C3C" strokeWidth="3" strokeLinecap="round" />
              <path d="M 155 65 L 165 75 M 165 65 L 155 75" stroke="#E74C3C" strokeWidth="3" strokeLinecap="round" />
              <path d="M 135 85 Q 150 80 165 85" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Thermometer */}
              <rect x="170" y="75" width="8" height="25" rx="4" fill="#E74C3C" />
              <circle cx="174" cy="102" r="6" fill="#E74C3C" />
            </>
          ) : type === 'vacation' ? (
            <>
              {/* Happy face with sunglasses */}
              <rect x="130" y="62" width="40" height="15" rx="7" fill="#2C3E50" />
              <path d="M 135 85 Q 150 92 165 85" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Sun hat */}
              <ellipse cx="150" cy="40" rx="45" ry="8" fill={char.color} />
              <path d="M 120 40 Q 150 20 180 40" fill={char.color} />
            </>
          ) : type === 'wfh' ? (
            <>
              {/* Focused face with glasses */}
              <rect x="130" y="62" width="40" height="15" rx="2" fill="none" stroke="#2C3E50" strokeWidth="2" />
              <circle cx="140" cy="69" r="8" fill="white" />
              <circle cx="160" cy="69" r="8" fill="white" />
              <circle cx="140" cy="69" r="4" fill="#2C3E50" />
              <circle cx="160" cy="69" r="4" fill="#2C3E50" />
              <path d="M 140 85 Q 150 88 160 85" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          ) : type === 'early' ? (
            <>
              {/* Neutral face */}
              <circle cx="140" cy="68" r="4" fill="#2C3E50" />
              <circle cx="160" cy="68" r="4" fill="#2C3E50" />
              <line x1="135" y1="85" x2="165" y2="85" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
              {/* Watch on wrist */}
              <rect x="235" y="90" width="15" height="10" rx="2" fill="#34495E" />
            </>
          ) : (
            <>
              {/* Worried face */}
              <circle cx="140" cy="68" r="4" fill="#2C3E50" />
              <circle cx="160" cy="68" r="4" fill="#2C3E50" />
              <path d="M 135 88 Q 150 83 165 88" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Sweat drops */}
              <motion.circle
                cx="125"
                cy="75"
                r="3"
                fill="#60A5FA"
                animate={{ y: [0, 10], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.circle
                cx="175"
                cy="75"
                r="3"
                fill="#60A5FA"
                animate={{ y: [0, 10], opacity: [1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </motion.g>

        {/* Additional Props */}
        {type === 'sick' && (
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* Medicine bottle */}
            <rect x="40" y="200" width="30" height="40" rx="5" fill="white" stroke="#E74C3C" strokeWidth="2" />
            <rect x="48" y="195" width="14" height="8" rx="2" fill="#E74C3C" />
            <text x="55" y="225" fontSize="20" fill="#E74C3C" textAnchor="middle">+</text>
          </motion.g>
        )}

        {type === 'vacation' && (
          <motion.g
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Beach ball */}
            <circle cx="250" cy="200" r="25" fill="#EF4444" />
            <path d="M 225 200 Q 250 180 275 200" fill="#3B82F6" />
            <path d="M 225 200 Q 250 220 275 200" fill="#FBBF24" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};

export default CharacterAnimation;
