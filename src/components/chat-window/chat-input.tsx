import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { useEffect, useRef } from "react";

type ChatInputProps = {
  onInputChange?: (value: string) => void; // now optional
  onSendClick?: (value: boolean) => void;
  cleartext: boolean;
};

const ChatInput = ({
  onInputChange,
  onSendClick,
  cleartext,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (cleartext) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [cleartext]);
  return (
    <InputGroup>
      <InputGroupTextarea
        ref={inputRef}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendClick?.(true);
          }
        }}
        onChange={(e) => onInputChange?.(e.target.value)} // safe optional call
        placeholder="Ask Chai GPT Anything"
      />
      <InputGroupAddon align="block-end" className="flex justify-between">
        <InputGroupText className="text-muted-foreground text-xs">
          120 Characters Left
        </InputGroupText>
        <Button
          onClick={() => onSendClick?.(true)}
          variant="outline"
          size="icon"
          aria-label="Submit"
          className="cursor-pointer"
        >
          <SendIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default ChatInput;
