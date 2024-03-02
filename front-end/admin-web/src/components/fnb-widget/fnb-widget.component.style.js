import styled from 'styled-components'

const FnbWidgetStyle = styled.div`
  .summary-card-average {
    background: ${(props) => props?.styles?.backgroundColor || '#50429B'};
    .section-total {
      .title {
        color: ${(props) => props?.styles?.color || '#FFFFFF'};
      }

      .ant-row:nth-child(3) {
        .summary-suffix {
          p.data {
            color: ${(props) => props?.styles?.color || '#FFFFFF'};
          }
        }
      }

      .ant-row:nth-child(2) {
        .summary-short-value {
          color: ${(props) => props?.styles?.color || '#FFFFFF'};
        }
      }
    }
  }
`

export default FnbWidgetStyle
