export const CONFIG = {
  STAFF_ROLE_ID: '1230949715127042098',
  BOOSTER_ROLE_ID: '1423037247606882399',
  VIP_ROLE_ID: '1423037247606882399',
  SPECIAL_USER_ID: '956700088103747625',
  
  NO_XP_CHANNELS: ['1313723272290111559', '1258524941289263254'],
  LEVEL_UP_CHANNEL: '1243975130908983356',
  
  LEVEL_REWARDS: {
    1: '1313715879816597514',
    5: '1313716079998140536',
    10: '1313716235573264437',
    20: '1313716306599481436',
    25: '1239330751334584421',
    30: '1438675114911596624',
    35: '1313716401021911102',
    40: '1313716612452581437',
    50: '1313716715934453761',
    75: '1313716864790302730',
    100: '1313716964383920269'
  },
  
  XP_COOLDOWN: 10000,
  NIGHT_BOOST_PERCENT: 25,
  BOOSTER_VIP_BOOST: 200,
  
  TRIVIA_COOLDOWN: 12 * 60 * 60 * 1000,
  RPS_COOLDOWN: 12 * 60 * 60 * 1000,
  ROULETTE_COOLDOWN: 24 * 60 * 60 * 1000,
  HANGMAN_SOLO_COOLDOWN: 2 * 24 * 60 * 60 * 1000,
  
  TRIVIA_REWARD_BOOST: 20,
  TRIVIA_REWARD_LEVELS: 1.5,
  RPS_REWARD_BOOST: 30,
  ROULETTE_WIN_LEVELS: 2.5,
  ROULETTE_LOSE_LEVELS: 3,
  HANGMAN_REWARD_BOOST: 25,
  HANGMAN_REWARD_LEVELS: 1
};

export const XP_FORMULA = {
  1: { multiplier: 50, speed: 'MUY RÁPIDA' },
  6: { multiplier: 75, speed: 'MUY RÁPIDA' },
  10: { multiplier: 100, speed: 'RÁPIDA' },
  15: { multiplier: 150, speed: 'MEDIANAMENTE RÁPIDA' },
  20: { multiplier: 200, speed: 'NORMAL' },
  35: { multiplier: 300, speed: 'MEDIANAMENTE NORMAL' },
  40: { multiplier: 400, speed: 'UN POCO LENTA' },
  50: { multiplier: 550, speed: 'MEDIANAMENTE LENTA' },
  75: { multiplier: 750, speed: 'LENTA' },
  90: { multiplier: 1000, speed: 'MUY LENTA' }
};

export function calculateXPRequired(level) {
  let multiplier = 50;
  
  if (level >= 90) multiplier = 1000;
  else if (level >= 75) multiplier = 750;
  else if (level >= 50) multiplier = 550;
  else if (level >= 40) multiplier = 400;
  else if (level >= 35) multiplier = 300;
  else if (level >= 20) multiplier = 200;
  else if (level >= 15) multiplier = 150;
  else if (level >= 10) multiplier = 100;
  else if (level >= 6) multiplier = 75;
  
  return Math.floor(multiplier * level);
}
