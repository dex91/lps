import { QuestionRAW, Question } from "./dateninterfaces";
export class formatDateninterfaces {

  /**
   * Formatiert das Objekt des Frage um, damit es nützlich wird bzw dem entspricht was wir benötigen
   * @param question Das Fragenobject an sich
   * @returns Das hier in Angular genutzte Objekt. (Entscheident ist hier das q_edited, dies kann nicht gesetzt sein!!!!!)
   */
  static formatQuestion(question: QuestionRAW): Question {

    let createdNumber = Number(question.q_created) * 1000;

    let timestamp = Number(question.q_edited);
    let editedToString = String(question.q_edited);

    if(timestamp !== 0) {
      let editedNumber = new Date(timestamp * 1000);
      return {
        ...question,
        q_created: new Date(createdNumber),
        q_edited: editedNumber,
        q_answered: false
      };

    } else {
      return {
        ...question,
        q_created: new Date(createdNumber),
        q_edited: new Date(editedToString),
        q_answered: false
      };
     }
  }
}
