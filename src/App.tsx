/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from "./components/chat-window/chat-input";
import { useState } from "react";
// import { getGiphyByText } from "./services/api.service";
import { v4 as uuid } from "uuid";
import { getGiphyByText } from "./services/api.service";
import { Button } from "./components/ui/button";
import { PlusIcon } from "lucide-react";
// he
export const giphytempUrl =
  "https://media3.giphy.com/media/3o85xGocUH8RYoDKKs/giphy.gif?cid=bd5b1230to9p8y18zgfjux7mpadotmj42co25k5m8x86jxfq&ep=v1_gifs_search&rid=giphy.gif";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any>([]);

  // conversations
  const [conversationsList, setConversationsList] = useState<any>({
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "Chai History",
        url: "#",
        items: [
          // { title: "Garam Chai", url: "#", isActive: false, messages: [] },
        ],
      },
    ],
  });
  const [activeConvId, setActiveConvId] = useState<string>();

  const [chatMessage, setChatMessage] = useState<string>("");
  const [clearChatInput, setclearChatInput] = useState<boolean>(false);

  const sendMessage = async () => {
    // create conv id and store inside conv array
    if (activeConvId) {
      const userMsg = {
        id: Date.now(),
        sender: "user",
        text: chatMessage,
      };
      // get gif and show here
      const giphyResponse: any = await getGiphyByText(chatMessage);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: giphyResponse?.[0]?.images?.fixed_height.url ?? "",
      };

      setConversationsList((prev: any) => ({
        ...prev,
        navMain: [
          {
            ...prev.navMain[0],
            items: prev.navMain[0].items.map((conv: any) =>
              conv.id === activeConvId
                ? { ...conv, messages: [...conv.messages, userMsg, aiMsg] }
                : conv
            ),
          },
        ],
      }));

      // Also update chat window if you're rendering from `messages` state
      setMessages((prev: any) => [...prev, userMsg, aiMsg]);
    } else {
      const newConvId = uuid();
      if (newConvId) {
        const userMsg = {
          id: Date.now(),
          sender: "user",
          text: chatMessage,
        };
        const giphyResponse: any = await getGiphyByText(chatMessage);
        const aiMsg = {
          id: Date.now() + 1,
          sender: "ai",
          text: giphyResponse?.[0]?.images?.fixed_height.url ?? "",
        };
        const newConversation = {
          id: newConvId,
          title:
            chatMessage.length > 25 ? chatMessage.slice(0, 25) : chatMessage,
          isActive: true,
          messages: [userMsg, aiMsg],
        };

        setActiveConvId(newConvId);
        setConversationsList((prev: any) => ({
          ...prev,
          navMain: [
            {
              ...prev.navMain[0],
              items: [
                ...prev.navMain[0].items.map((conv: any) => ({
                  ...conv,
                  isActive: false,
                  messages: [...conv.messages],
                })),
                newConversation,
              ],
            },
          ],
        }));

        // Assign messages directly, no need to read state here
        setMessages(newConversation.messages);
      }
    }
    setclearChatInput(true);
  };

  return (
    <SidebarProvider
      open={isSidebarOpen}
      onOpenChange={(val) => setIsSidebarOpen(val)}
    >
      <AppSidebar data={conversationsList} />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 fixed z-10 bg-white w-[-webkit-fill-available]">
          {!isSidebarOpen ? (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
          ) : null}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">ChaiGPT Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chat Mode</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            onClick={() => {setActiveConvId(''); setMessages([])}}
            variant="outline"
            size="icon"
            aria-label="new chat"
            className="cursor-pointer ml-auto"
          >
            <PlusIcon />
          </Button>
        </header>

        {/* Scrollable Chat Messages */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3 p-4 pb-32 mt-16">
            {messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm text-base ${
                  msg.sender === "ai"
                    ? "bg-muted self-start"
                    : "bg-primary text-primary-foreground self-end"
                }`}
              >
                {msg.sender === "ai" ? (
                  <img src={msg.text} className="w-sm" />
                ) : (
                  msg.text
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Fixed Bottom Chat Input */}
        <div className="border-t p-4 bg-white">
          <ChatInput
            cleartext={clearChatInput}
            onInputChange={setChatMessage}
            onSendClick={sendMessage}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
