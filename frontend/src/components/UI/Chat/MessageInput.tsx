import TextInput from '@/components/UI/Inputs/TextInput';
import Button from '@/components/UI/Button';
import SendIcon from '@/components/UI/Assets/SendIcon';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export default function MessageInput({ messageInput, setMessageInput, handleSendMessage, handleKeyPress }: MessageInputProps) {
  return (
      <div className='flex items-center gap-3 mt-auto' onKeyDown={handleKeyPress}>
        <TextInput 
          className='flex-1' 
          placeholder='Type your message here...' 
          label='Message' 
          name='message' 
          type='text' 
          autoComplete='off' 
          value={messageInput} 
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button 
          className='p-3 h-full rounded-md'
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
        >
          <SendIcon size={16} />
        </Button>
      </div>
  )
}
