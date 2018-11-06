class BaseCharacter{
  constructor(name, hp, ap){
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  heal(){
    var beforeHeal = this.maxHp - this.hp;

    if ((this.alive == false) || (this.hp >= this.maxHp)){
      return;
    }else if ((this.maxHp - this.hp) < 30) {
      this.hp += (this.maxHp - this.hp);
    }else{
      this.hp += 30;
    }

    var _this = this;
    var i = 1;

    _this.id = setInterval(function(){
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        if ((beforeHeal) < 30) {
          _this.element.getElementsByClassName("heal-text")[0].textContent = beforeHeal;
        }else{
          _this.element.getElementsByClassName("heal-text")[0].textContent = 30;
        }
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/'+ i +'.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);    
  }

  attack(character, damage){
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  }
  getHurt(damage){
    this.hp -= damage;
    if (this.hp <= 0) {
      this.die();
    }

    var _this = this;
    var i = 1;

    _this.id  = setInterval(function(){
      if (i == 1) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/'+ i +'.png';
      i++;

      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }
    },50);
  }

  die(){
    this.alive = false;
  }
  updateHTML(hpElement, hurtElement){
    hpElement.textContent = this.hp;
    hurtElement.style.width = (100 - this.hp/this.maxHp * 100) + "%";
  }
}

//Hero Class ---------------------------------------------------------

class Hero extends BaseCharacter{
  constructor(name, hp, ap){
    super(name, hp, ap);

    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("召喚英雄" + this.name + "!");  
  }

  attack(character){
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage){
    super.getHurt(damage);
    this.updateHTML(this.hpElement, this.hurtElement);
  }

  heal(){
    super.heal();
    this.updateHTML(this.hpElement, this.hurtElement);
  }
}

//Monster Class ------------------------------------------------------

class Monster extends BaseCharacter{
  constructor(name, hp, ap){
    super(name, hp, ap);

    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("遇到怪獸" + this.name + "!");
  }

  attack(character){
    var damage = Math.random() * (this.ap/2) + (this.ap/2);
    super.attack(character, Math.floor(damage));
  }

  getHurt(damage){
    super.getHurt(damage);
    this.updateHTML(this.hpElement, this.hurtElement);
  }
}



//Console.log testing -----------------------------------------------

var hero = new Hero("Jack", 130, 30);
var monster = new Monster("doggy", 130, 25);


//設計戰鬥流程 -----------------------------------------------

function finish(){
  // 遊戲結束跳出視窗
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  }else{
    dialog.classList.add("lose");
  }
}

var rounds = 10;
function endTurn(){
  //代表回合結束
  rounds --;
  document.getElementById("round-num").textContent = rounds;
  if(rounds < 1){
    finish();
  }
}

function heroAttack(){
  //Hero 點選技能時觸發攻擊開始
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function(){
    hero.element.classList.add("attacking");
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    },500);
  },100);

  setTimeout(function(){
    if (monster.alive) {
      monster.element.classList.add("attacking");
      setTimeout(function(){
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        endTurn();
        if (hero.alive == false) {
          finish();
        }else{
          setTimeout(function(){
            document.getElementsByClassName("skill-block")[0].style.display = "block";
          },450);
        }
      },500);
    }else{
      finish();
    }
  },1100);

}

function heroHeal(){
  //Hero 點選技能啟動回血技能
  document.getElementsByClassName("skill-block")[0].style.display = "none";

  setTimeout(function(){
    hero.element.classList.add("healing");
    setTimeout(function(){
      hero.heal();
      hero.element.classList.remove("healing");
    },500);
  },100);

  setTimeout(function(){
    monster.element.classList.add("attacking");
    setTimeout(function(){
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      endTurn();
      if (hero.alive == false) {
        finish();
      }else{
        setTimeout(function(){
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        },450);
      }
    },500);
  },1100);

}

function addSkillEvent(){
  //addSkillEvent 本意為「詢問使用者是否開始遊戲」的function，以防有人不小心直接開始遊戲
  var skill = document.getElementById("skill");
  skill.onclick  = function(){
    heroAttack();
  }

  var heal = document.getElementById("heal");
  heal.onclick = function(){
    heroHeal();
  }
}

addSkillEvent();





















































