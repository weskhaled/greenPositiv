import { Alert, Avatar, Badge, Breadcrumb, Button, Checkbox, Col, ConfigProvider, DatePicker, Descriptions, Divider, Drawer, Dropdown, Form, Input, InputNumber, Layout, Menu, Modal, Pagination, Popover, Radio, Result, Row, Select, Skeleton, Spin, Statistic, Steps, Switch, Table, Tabs, Tag, Tooltip, Transfer, Upload } from 'ant-design-vue'

import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, app }) => {
  if (isClient) {
    app.use(Alert)
      .use(ConfigProvider)
      .use(Input)
      .use(Button)
      .use(Table)
      .use(Layout)
      .use(Menu)
      .use(Dropdown)
      .use(Breadcrumb)
      .use(Popover)
      .use(Steps)
      .use(Tabs)
      .use(Badge)
      .use(Result)
      .use(Avatar)
      .use(Select)
      .use(Row)
      .use(Col)
      .use(Modal)
      .use(Form)
      .use(InputNumber)
      .use(DatePicker)
      .use(Checkbox)
      .use(Radio)
      .use(Switch)
      .use(Pagination)
      .use(Spin)
      .use(Skeleton)
      .use(Tooltip)
      .use(Tag)
      .use(Upload)
      .use(Divider)
      .use(Transfer)
      .use(Drawer)
      .use(Descriptions)
      .use(Statistic)
  }
}
