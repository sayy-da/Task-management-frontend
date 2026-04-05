import "../App.css";

const FilterTabs = ({ filter, setFilter }) => {
  const tabs = ["All", "Pending", "In Progress", "Completed"];

  return (
    <div className="filter-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`filter-tab ${filter === tab ? "active" : ""}`}
          onClick={() => setFilter(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
