/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, LitElement, property} from "lit-element";
import './backend-ai-indicator';


class Task {
  taskid: number | null;
  taskobj: Object;
  status: string;
  created_at: number;

  constructor(obj: Object, id: number | null) {
    this.taskid = id;
    this.taskobj = obj;
    this.created_at = Date.now();
    this.status = 'active';
  }

  remove() {
    delete this.taskobj;
  }
}

/**
 Backend.AI Task manager for Console

 `backend-ai-tasker` is a background task manager for console.

 Example:
 @group Backend.AI Console
 @element backend-ai-tasker
 */
@customElement("backend-ai-tasker")
export default class BackendAiTasker extends LitElement {
  public shadowRoot: any;
  public updateComplete: any;

  @property({type: Object}) indicator;
  @property({type: Object}) notification;
  @property({type: Array}) taskstore;
  @property({type: Array}) finished;
  @property({type: Object}) pooler;

  constructor() {
    super();
    this.taskstore = [];
    this.finished = [];
    this.pooler = setInterval(() => {
      this.gc();
    }, 10000);
  }

  static get styles() {
    return [
      // language=CSS
      css``];
  }

  render() {
    // language=HTML
    return html`
      <backend-ai-indicator id="indicator"></backend-ai-indicator>
    `;
  }

  shouldUpdate() {
    return this.active;
  }

  firstUpdated() {
    this.notification = globalThis.lablupNotification;
    this.indicator = this.shadowRoot.querySelector('#indicator');
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  add(task, taskid: string = '') {
    if (taskid === '') {
      taskid = this.generate_UUID();
    }
    let item = new Task(task, taskid);
    task.then(() => {
        this.finished.push(taskid);
      }
    );
    this.taskstore.push(item);
    console.log(item);
  }

  remove(taskid: string = '') {
    let result = this.taskstore.filter(obj => {
      return obj.taskid === taskid
    });
    if (result.length > 0) {
      let index = this.taskstore.indexOf(result[0]);
      if (index > -1) {
        result[0].remove();
        this.taskstore.splice(index, 1);
      }
      delete result[0];
      index = this.finished.indexOf(taskid);
      if (index > -1) {
        this.finished.splice(index, 1);
      }
    }
  }

  generate_UUID() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  gc() {
    if (this.finished.length > 0) {
      this.finished.forEach((item) => {
        this.remove(item);
      });
    }
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "backend-ai-tasker": BackendAiTasker;
  }
}
