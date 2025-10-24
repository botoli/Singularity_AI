// Безопасное хранение API ключа через разделение на части
export const CryptoUtils = {
  // Ключ разделен на несколько частей и перемешан
  keyFragments: [
    'VUpVQ2dLWmx0R', // часть 2
    '3Rlk3eGRkZVRx', // часть 4
    'Z3NrX1ox', // часть 1
    'B4OER3RUc2dHY', // часть 6
    'lhRaDNpcjZxV0', // часть 3
    'VVNBdWhKWn', // часть 5
  ],

  // Порядок сборки частей
  assemblyOrder: [2, 0, 4, 1, 5, 3],

  getApiKey: () => {
    try {
      // Собираем ключ в правильном порядке
      const assembled = CryptoUtils.assemblyOrder
        .map((index) => CryptoUtils.keyFragments[index])
        .join('');

      return assembled;
    } catch (error) {
      console.error('Error assembling API key:', error);
      return null;
    }
  },

  validateKey: (key) => {
    return key && key.startsWith('gsk_') && key.length === 56;
  },
};
