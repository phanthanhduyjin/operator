import { WidgetDatas } from './WidgetDatas'

export class WidgetDatasForNoTabs extends WidgetDatas {
  _PaneDataAsParent
  constructor(
    paneDataAsParent,
    cloneSrcWidgetDatasForNoTabs,
    oWidgetDatasForNoTabs,
  ) {
    super(cloneSrcWidgetDatasForNoTabs, oWidgetDatasForNoTabs)
    this._PaneDataAsParent = paneDataAsParent
  }

  setWidgetDatasForNoTabDataToObject(o) {
    super._setWidgetDatasToObject(o)
  }
}
