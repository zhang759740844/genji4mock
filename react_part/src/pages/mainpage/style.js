import styled from 'styled-components'

export const LogoContainer = styled.div`
  display: flex;
  float: right;
  align-items: center;
  .img {
    width: 31px;
    height: 31px;
    border-radius: 50%;
  }
  .text {
    margin-left: 10px;
    font-size: 15px;
    color: white;
  }
`

export const SiderContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 64px - 30px);
  display: flex;
  flex-direction: column;
  padding: 10px;
  .bottom {
    height: 30px;
    background: white;
    border-top: 1px solid lightgray;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
  .button {
    float: right;
    width: 100px;
    margin: 10px 10px 10px 10px;
  }
`

export const ItemContainer = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  span {
    flex: 1;
  }
`

export const DataHeaderContainer = styled.div`
  display: flex;
  height: 60px;
  margin-bottom: 10px;
  align-items: center;
  width: 100%;
  background: white;
  padding: 0 20px 0 20px;
  .interface {
    flex: 1;
    font-weight: bold;
  }
  .hint {
    margin-right: 10px
  }
`
export const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  .textarea {
    flex: 1
  }
  .btn-container {
    display: flex;
    width: 100%;
    margin-top: 10px;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: -10px;
  }
  .delete-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
    color: white;
    font-size: 20px;
    height: 40px
  }
  .save-btn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(42, 121, 254);
    color: white;
    font-size: 20px;
    height: 40px;
  }
  .format {
    position: absolute;
    right: 20px;
    bottom: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: red;
    color: white;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
`

export const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  b {
    margin-bottom: 10px;
    margin-top: 10px;
  }
`
export const DrawerBottomContainer = styled.div`
  position: absolute;
  border-top: 1px solid lightgray;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  .button {
    float: right;
    width: 80px;
    margin: 10px 10px 10px 10px;
  }
`
