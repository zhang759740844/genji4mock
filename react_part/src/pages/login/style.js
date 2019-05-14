import styled from 'styled-components'

export const LoginContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  .img {
    height: 80px;
    width: 80px;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 50%;
  }
  button {
    margin-bottom: 20px;
    border-radius: 18px;
    height: 36px;
  }
  u {
    font-size: 16px;
    color: blue;
    float: right;
    text-align: right;
    margin: -10px 10px 10px 0;
  }
`
export const ErrorContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 60px;
  .alert {
    height: 60px;
  }
`

export const ItemContainer = styled.div`
  width: 300px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid lightgray;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 10px;
  .iconfont {
    color: lightgray;
  }
  .input {
    flex: 1;
    margin-left: 10px;
    border: 0;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    ::placeholder {
      color: lightgray;
    }
  }
`
