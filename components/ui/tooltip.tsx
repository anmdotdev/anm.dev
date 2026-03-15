import { Arrow, Content, Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip'

export default ({ children, content }: { content: React.ReactNode; children: React.ReactNode }) => (
  <Provider delayDuration={300} skipDelayDuration={100}>
    <Root>
      <Trigger>{children}</Trigger>
      <Portal>
        <Content
          className="select-none rounded bg-black px-[15px] py-2.5 text-[15px] text-white leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          {content}
          <Arrow className="fill-black" />
        </Content>
      </Portal>
    </Root>
  </Provider>
)
