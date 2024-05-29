import { Badge, Segmented } from 'antd';
import './button-group-with-badges.component.scss'
import { useEffect } from 'react';
import { OrderStatusColor } from 'constants/order-status.constants';
import { t } from 'i18next';
export default function HorizontalButtonGroup(props) {
  const { options, onChange, defaultValue, dataSource, className } = props
  const pageData = {
    status: [
      t('order.statusNew'),
      t('order.statusConfirm'),
      t('order.statusDelivering'),
      t('order.statusComplete'),
      t('order.statusReturn'),
      t('order.statusCancel'),
      t('order.statusDraft')
    ]

  }
  return (
    <Segmented
      defaultValue={defaultValue}
      options={options.map((option, key) => {
        return {
          label: (
            <div className={`d-flex p-2 w-100  align-items-center ${OrderStatusColor[key]}`}>
              <div className="mx-auto">
                {pageData.status[key]}
              </div>
              <Badge count={dataSource?.filter(data => data?.status === key).length} />
            </div>
          ),
          value: key
        }
      })}
      onChange={onChange}
      className={className}
    />
  );
}
