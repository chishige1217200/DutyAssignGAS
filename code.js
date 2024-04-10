/**
 * スプレッドシート情報
 * @type {SpreadSheet}
 */
var ss = SpreadsheetApp.getActiveSpreadsheet();

// 各曜日の当番と担当者を格納するクラスです
class Assigner {
  /**
   * @param {string[]} dutys 当番内容情報
   */
  constructor(dutys) {

    if (dutys.length < 2)
      throw new RangeError('当番内容情報の長さが不足しています．');

    /**
     * 曜日情報（Day Of Week）
     * @type {string}
     */
    this._dow = dutys[0];

    /**
     * 当番内容情報（添字順で対応）
     * @type {string[]}
     */
    this._dutys = [];
    for (let i = 1; i < dutys.length; i++) {
      if (dutys[i] === '') break;
      this._dutys.push(dutys[i]);
    }

    if (this._dutys.length === 0)
      throw new RangeError('当番内容情報がありません．');

    /**
     * 担当者情報（添字順で対応）
     * @type {Member[]}
     */
    this._charges = [];
  }

  /**
   * 担当者を割り当てる
   * @param {Member} member 担当者の名前
   */
  assign(member) {
    if (this._charges.length < this._dutys.length)
      this._charges.push(member);
    else
      throw new RangeError("当番内容に対して担当者が多すぎます．");
  }
}

// 当番候補者のクラスです
class Member {
  /**
   * @param {string} name 名前
   * @param {number} count 充当回数
   */
  constructor(name, count) {

    /**
     * 名前
     * @type {string}
     */
    this._name = name;

    /**
     * 充当回数
     * @type {number}
     */
    this._count = count;
  }

  /**
   * 名前を取得します
   * @return {string} 名前
   */
  get getName() {
    return this._name;
  }

  /**
   * 充当回数を取得します
   * @return {number} 充当回数
   */
  get getCount() {
    return this._count;
  }

  /**
   * 充当回数を1増やす
   */
  addCount() {
    _count += 1;
  }
}

// 候補者管理クラスです
class MemberManager {
  /**
  * @param {string[][]} members 名前と充当回数のリスト（複数人）
  */
  constructor(members) {
    /**
     * 候補者リスト
     * @type {Member[]}
     */
    this._members = [];
    for (let i = 0; i < members.length; i++) {
      if (members[i].length < 2) throw new RangeError('候補者の情報が不足しています．');
      if (members[i][1] === '') throw new ReferenceError('回数の値が無効です．');

      this._members.push(new Member(members[i][0], members[i][1]));
    }
  }

  /**
  * 充当回数を取得します
  * @return {number} 充当回数
  */
  get getCount() {
    return this._count;
  }
}

// TODO:候補者管理クラスがほしい
// クラスメソッドとして，充当回数が最も少ない人のIDをリストで返す（下のメソッドで使用する）
// クラスメソッドとして，候補リストから重複無しでランダムにIDを取得する（ただし，候補リストの長さが0となった場合は，上のメソッドで再度取得し直す）
// 候補リストから使用した場合は，addCountをする

// 当番数（最大2つ）より候補者が少ない場合について検討が必要

/**
 * @return {string} 指定の体裁で時刻を返します
 */
function getDateString(format) {
  let date = new Date();
  return Utilities.formatDate(date, "GMT+9", format).toString();
}

function main() {
  /**
   * 当番情報を取得します
   * @return {string[][]} 曜日と当番のリスト
   */
  function loadDutys() {
    let dutysSheet = ss.getSheetByName('dutys');
    if (dutysSheet === null) throw new ReferenceError('dutysシートが存在しません．');
    return dutysSheet.getRange(2, 1, dutysSheet.getLastRow() - 1, dutysSheet.getLastColumn()).getValues();
  }

  /**
   * メンバー情報を取得します
   * @return {string[][]} メンバーと担当回数のリスト
   */
  function loadMembers() {
    let membersSheet = ss.getSheetByName('members');
    if (membersSheet === null) throw new ReferenceError('membersシートが存在しません．');
    return membersSheet.getRange(2, 1, membersSheet.getLastRow() - 1, membersSheet.getLastColumn()).getValues();
  }

  /**
   * 当番情報
   * @type {string[][]}
   */
  let dutys = loadDutys();
  /**
   * メンバー情報
   * @type {string[][]}
   */
  let members = loadMembers();

  console.log(getDateString('yyyyMMdd_HHmmss'));
  console.log(dutys);
  console.log(members);

  let memberManager = new MemberManager(members);

  console.log(memberManager);

}
