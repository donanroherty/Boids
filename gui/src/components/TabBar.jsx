import Tab from "./Tab"

function TabBar(props) {
  return (
    <div class="flex w-full justify-items-start border-l-[1px] border-r-[1px] border-solid border-black bg-gray-200 pb-0">
      {props.tabData.map((data, i) => {
        return (
          <Tab
            idx={i}
            color={data.color}
            onTabClick={() => props.selectTab(i)}
            onTabClose={() => props.closeTab(i)}
            active={props.selectedTab === i}
          />
        )
      })}

      <div class="m-0 flex h-full w-10 select-none justify-center p-1 text-sm">
        <div
          onClick={props.addTab}
          class={`flex h-6 w-6 justify-center 
          ${props.tabData.length < props.maxTabs ? "bg-gray-100" : "bg-transparent"} 
          m-0 mt-auto rounded border-[1px] border-t-[1px] border-l-[1px] border-solid border-gray-300 p-1 text-sm
        `}
        >
          <div
            class={`-mt-0.5 text-gray-200
            ${props.tabData.length < props.maxTabs ? "text-black" : "text-gray-300"}
            `}
          >
            +
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabBar
