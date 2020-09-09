//抽牌Btn
document.getElementById('dispatch').addEventListener('click', () => {
  getDataFromServer(1);
});

//resetBtn
document.getElementById('reset').addEventListener('click', () => {
  document.getElementById('dispatch').disabled = true;
  document.getElementById('reset').disabled = true;
  document.getElementById('over').disabled = true;
  document.getElementById('point').innerHTML = `目前點數 0`;
  getDataFromServer(2);
  // timer =setInterval(()=>{
  //   setGame();
  // }, 600); 
  
});

//banker's turn
document.getElementById('over').addEventListener('click', () => {
  displayCard(card,'b-cards-ff');
  document.getElementById('b-card-f').classList.add('set');
  bankerTurn();
});


const getDataFromServer = async (m) => {
  try {
    // 連接伺服器
    const url = 'http://localhost/practice/21points/bankGetCard.php';
    const response = await fetch(`${url}`, {
      // 使用的方法
      method: 'POST',
      // 指示此資料為json格式
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // 傳送的主體資料(json格式)
      body: JSON.stringify({
        'cards': '',
        'method' : m,
        'totalB':''
      })
    });

    // 由response物件，剖析出json資料
    const data = await response.json();
    // const data = await response.text();
    // console.log(data);

    //dispatch a card for player
    if(m==1){
      const card = createCard2(data.card.suit,data.card.point);
      displayCard(card,'cards');
      document.getElementById('point').innerHTML = `目前點數 ${data.total>21?'Bang':data.total}`;
    }
    //reset game
    if(m==2){
      // 清空所有的顯示文字
      document.getElementById('cards').innerHTML = ``;
      document.getElementById('result').innerHTML = '';
      document.getElementById('b-cards').innerHTML = 
      `<div class="flip-card">
          <div class="flip-card-inner" id="b-card-f">
            <div class="flip-card-front" id="b-cards-fb"></div>
            <div class="flip-card-back" id="b-cards-ff"></div>
        </div>
      </div>`;
      document.getElementById('b-point').innerHTML = '';
      document.getElementById('b-result').innerHTML = '';
      timer =setInterval(()=>{
        setGame(data.card,data.total);
      }, 600); 
    }
    //banker's turn
    if(m==3){
      if(data.card.point>0){
        card = createCard2(data.card.suit,data.card.point);
        displayCard(card,'b-cards');
        document.getElementById('b-point').innerHTML = `目前點數 ${data.totalB>21?'Bang':data.totalB}`;
      }
      if (data.total > data.totalB){
        if(data.total>data.totalB)
         setTimeout(bankerTurn, 2000);
      }
      else{
        document.getElementById('dispatch').disabled = true;
        document.getElementById('over').disabled = true;
         //you lose
        if(data.total < data.totalB){
          document.getElementById('b-result').innerHTML = '你輸了 大爛咖';
        }

        //平手
        if(data.total == data.totalB){
          document.getElementById('b-result').innerHTML = '平手';
        }   

        
      }
    }
    
    if(data.total>21){
      // console.log("!!!!!")
      document.getElementById('result').innerHTML = `爆掉了`;
      document.getElementById('dispatch').disabled = true;
      document.getElementById('over').disabled = true;
    }
    if(data.totalB>21){
      document.getElementById('b-result').innerHTML = `You Win`;
      document.getElementById('dispatch').disabled = true;
      document.getElementById('over').disabled = true;
    }
    return 0;

  } catch (error) {
    console.log(error);
    return false;
  }
};

//draw a card
const createCard2 = (flower, point)=>{
  let display = '';
  switch (point) {
    case 1:
      display = 'A';
      break;
    case 11:
      display = 'J';
      break;
    case 12:
      display = 'Q';
      break;
    case 13:
      display = 'K';
      break;
    default:
      display = point;
      break;
  }

  return Poker.getCardImage(150, flower, display);
}
// 呈現卡牌用
const displayCard = (card,id) => {
  document.getElementById(id).appendChild(card);
};
// init a game
const setGame = (cards,total)=>{
  if(cards.length==1)
  {
    card = createCard2(cards[0].suit,cards[0].point);
    document.getElementById('point').innerHTML = `目前點數 ${total}`;
    document.getElementById('dispatch').disabled = false;
    document.getElementById('reset').disabled = false;
    document.getElementById('over').disabled = false;
    
    clearInterval(timer);
  }
  switch (cards.length){
    case 2:
    case 4:
      card = createCard2(cards[cards.length-1].suit,cards[cards.length-1].point);
      displayCard(card,'cards');
      break;
    case 1:
      displayCard(Poker.getBackCanvas(150, '#FaA', '#a22'),'b-cards-fb');
      break;
    case 3:
      card = createCard2(cards[2].suit,cards[2].point);
      displayCard(card,'b-cards');
      break;
      default:
      break;
    }
  cards.pop();
}

const bankerTurn=()=>{
    getDataFromServer(3);
}