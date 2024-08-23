import { Message } from "@aws-sdk/client-sqs";
import { Injectable } from "@nestjs/common";
import { SqsConsumerEventHandler, SqsMessageHandler } from "@ssut/nestjs-sqs";

@Injectable()
export class MessageHandler {

  // @SqsMessageHandler("test.fifo", false)
  // async handleMessage(message : Message)
  // {
  //   console.log("handleMessage")
  //   console.log(message)
    
  // } 

  @SqsConsumerEventHandler(/** name: */ "test.fifo", /** eventName: */ 'processing_error')
  public onProcessingError(error: Error, message: Message) {
    console.log("SqsConsumerEventHandler")
    console.log(message)
    console.log(error)
  }

  @SqsConsumerEventHandler(/** name: */ "test.fifo", /** eventName: */ 'timeout_error')
  public onProcessingTimeError(error: Error, message: Message) {
    console.log("onProcessingTimeError")
    console.log(message)
    console.log(error)
  }

}